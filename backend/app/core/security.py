import base64
import hashlib
import hmac
import json
import time
from typing import Any, Dict, Optional

from app.core.config import settings


def hash_password(password: str) -> str:
    """Hash password using PBKDF2-HMAC-SHA256."""
    salt = hashlib.sha256(settings.secret_key.encode()).digest()[:16]
    derived = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000)
    return base64.b64encode(salt + derived).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against hashed password."""
    try:
        decoded = base64.b64decode(hashed_password.encode("utf-8"))
        salt = decoded[:16]
        expected_derived = decoded[16:]
        actual_derived = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt, 100_000)
        return hmac.compare_digest(actual_derived, expected_derived)
    except Exception:
        return False


def create_access_token(subject: str, expires_minutes: Optional[int] = None) -> str:
    """Create a signed JWT token."""
    if expires_minutes is None:
        expires_minutes = settings.access_token_expire_minutes

    header = {"alg": settings.algorithm, "typ": "JWT"}
    now = int(time.time())
    payload = {
        "sub": subject,
        "iat": now,
        "exp": now + (expires_minutes * 60),
    }

    header_b64 = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
    payload_b64 = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")

    signature_input = f"{header_b64}.{payload_b64}".encode()
    signature = hmac.new(settings.secret_key.encode(), signature_input, hashlib.sha256).digest()
    signature_b64 = base64.urlsafe_b64encode(signature).decode().rstrip("=")

    return f"{header_b64}.{payload_b64}.{signature_b64}"


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and verify JWT access token."""
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None

        header_b64, payload_b64, signature_b64 = parts

        # Verify signature
        signature_input = f"{header_b64}.{payload_b64}".encode()
        expected_sig = hmac.new(settings.secret_key.encode(), signature_input, hashlib.sha256).digest()

        # Add padding back if necessary
        sig_padding = "=" * (-len(signature_b64) % 4)
        actual_sig = base64.urlsafe_b64decode(signature_b64 + sig_padding)

        if not hmac.compare_digest(expected_sig, actual_sig):
            return None

        payload_padding = "=" * (-len(payload_b64) % 4)
        payload = json.loads(base64.urlsafe_b64decode(payload_b64 + payload_padding).decode())

        if payload.get("exp", 0) < time.time():
            return None

        return payload
    except Exception:
        return None
