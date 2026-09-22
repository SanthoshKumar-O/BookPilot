from typing import List, Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.models import RecommendedResource, User
from app.db.session import get_db
from app.modules.auth.dependencies import get_current_user

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


class RecommendedResourceResponse(BaseModel):
    id: str
    resource_id: str
    concept_id: Optional[str] = None
    title: str
    url: str
    type: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


@router.get("/{resource_id}", response_model=List[RecommendedResourceResponse])
def get_recommendations(
    resource_id: str,
    concept_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get contextual recommended external resources (interactive visualizations, docs, tutorials)."""
    query = db.query(RecommendedResource).filter(RecommendedResource.resource_id == resource_id)
    if concept_id:
        query = query.filter(RecommendedResource.concept_id == concept_id)

    recommendations = query.all()
    if not recommendations:
        rec1 = RecommendedResource(
            resource_id=resource_id,
            concept_id=concept_id,
            title="Interactive Visualizing Gradient Descent & Optimization",
            url="https://distill.pub/2017/momentum/",
            type="article",
            description="Deep interactive guide explaining momentum and optimization step sizes.",
        )
        rec2 = RecommendedResource(
            resource_id=resource_id,
            concept_id=concept_id,
            title="3Blue1Brown: Essence of Calculus & Neural Networks",
            url="https://www.youtube.com/watch?v=aircAruvnKk",
            type="video",
            description="Visual intuition for derivatives and backpropagation.",
        )
        db.add_all([rec1, rec2])
        db.commit()
        db.refresh(rec1)
        db.refresh(rec2)
        recommendations = [rec1, rec2]

    return recommendations
