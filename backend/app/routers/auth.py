from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel

from .. import models, schemas
from ..database import get_db
from ..auth_utils import (
    hash_password,
    verify_password,
    create_access_token,
)
from ..deps import get_current_user

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
)


class ResetPasswordRequest(BaseModel):
    email: str
    new_password: str


@router.post(
    "/signup",
    response_model=schemas.Token,
    status_code=status.HTTP_201_CREATED,
)
def signup(
    payload: schemas.UserSignup,
    db: Session = Depends(get_db),
):
    clean_email = payload.email.strip().lower()
    existing = (
        db.query(models.User)
        .filter(func.lower(models.User.email) == clean_email)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists",
        )

    user = models.User(
        full_name=payload.full_name.strip(),
        email=clean_email,
        hashed_password=hash_password(payload.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(
        {"sub": str(user.id)}
    )

    return schemas.Token(
        access_token=token,
        user=user,
    )


@router.post(
    "/login",
    response_model=schemas.Token,
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    clean_username = form_data.username.strip().lower()
    user = (
        db.query(models.User)
        .filter(
            func.lower(models.User.email) == clean_username
        )
        .first()
    )

    if (
        not user
        or (
            not verify_password(form_data.password, user.hashed_password)
            and not verify_password(form_data.password.strip(), user.hashed_password)
        )
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    token = create_access_token(
        {"sub": str(user.id)}
    )

    return schemas.Token(
        access_token=token,
        user=user,
    )


@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    clean_email = data.email.strip().lower()
    user = (
        db.query(models.User)
        .filter(func.lower(models.User.email) == clean_email)
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=404,
            detail="Account with this email does not exist",
        )
    user.hashed_password = hash_password(data.new_password.strip())
    db.commit()
    return {"status": "success", "message": "Password updated successfully"}


@router.get(
    "/me",
    response_model=schemas.UserOut,
)
def get_me(
    current_user: models.User = Depends(
        get_current_user
    ),
):
    return current_user