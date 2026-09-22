import os
import sys

# Ensure backend directory is in python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.base import Base
from app.modules.ai.router import companion_chat
from app.modules.analytics.router import get_user_stats
from app.modules.auth.router import login, register
from app.modules.coding.router import get_coding_problems, submit_code
from app.modules.learning.router import generate_chapter_quiz, submit_quiz_attempt
from app.modules.reader.router import update_reading_progress
from app.modules.resources.router import import_resource_url
from app.schemas.ai import ChatQuery
from app.schemas.auth import UserLogin, UserRegister
from app.schemas.coding import CodeSubmitRequest
from app.schemas.learning import QuizSubmit
from app.schemas.reader import ProgressUpdate
from app.schemas.resources import ResourceURLImport

# Setup SQLite test DB
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)


def run_tests():
    db = TestingSessionLocal()
    try:
        # 1. Register User
        reg_in = UserRegister(email="test@bookpilot.ai", password="securepassword123", full_name="Test Learner")
        user = register(reg_in, db)
        assert user.email == "test@bookpilot.ai"
        print("✓ Auth Register test passed")

        # 2. Login User
        login_in = UserLogin(email="test@bookpilot.ai", password="securepassword123")
        token_data = login(login_in, db)
        assert token_data.access_token is not None
        print("✓ Auth Login test passed")

        # 3. Import Resource via URL
        url_in = ResourceURLImport(url="https://example.com/ml_book.pdf", title="Machine Learning Pilot")
        res = import_resource_url(url_in, current_user=user, db=db)
        assert res.status == "ready"
        print("✓ Resource Ingestion & Processing test passed")

        # 4. Reading Progress Update
        prog_in = ProgressUpdate(resource_id=res.id, current_page=14, completion_percentage=45.0)
        prog = update_reading_progress(prog_in, current_user=user, db=db)
        assert prog.current_page == 14
        print("✓ Reading Progress Tracking test passed")

        # 5. AI Companion RAG Chat
        chat_in = ChatQuery(resource_id=res.id, current_page=14, query="Explain gradient descent simply", mode="tutor")
        chat_resp = companion_chat(chat_in, current_user=user, db=db)
        assert "gradient" in chat_resp.assistant_message.content.lower() or "concept" in chat_resp.assistant_message.content.lower()
        print("✓ Context-Aware RAG Learning Companion test passed")


        # 6. Chapter Quiz Generation & Attempt
        quiz = generate_chapter_quiz(resource_id=res.id, current_user=user, db=db)
        assert quiz.id is not None
        sub_in = QuizSubmit(answers={})
        attempt = submit_quiz_attempt(quiz.id, sub_in, current_user=user, db=db)
        assert attempt.score is not None
        print("✓ Quiz Generation & Scoring test passed")

        # 7. Coding Submission
        problems = get_coding_problems(resource_id=res.id, current_user=user, db=db)
        code_in = CodeSubmitRequest(problem_id=problems[0].id, submitted_code="def gradient_descent_step(w, dw, lr=0.01):\n    return w - (lr * dw)")
        sub = submit_code(code_in, current_user=user, db=db)
        assert sub.status == "passed"
        print("✓ Integrated Coding Environment test passed")

        # 8. User Analytics Stats
        stats = get_user_stats(current_user=user, db=db)
        assert stats.quizzes_taken >= 1
        print("✓ Analytics Dashboard test passed")

    finally:
        db.close()
        if os.path.exists("./test.db"):
            try:
                os.remove("./test.db")
            except Exception:
                pass


if __name__ == "__main__":
    run_tests()
    print("\n🎉 ALL BOOKPILOT END-TO-END VERIFICATION TESTS PASSED SUCCESSFULLY!")
