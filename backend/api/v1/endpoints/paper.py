from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....db.session import get_db
from ....crud.paper import create_paper
from ....schemas.paper import Paper, PaperCreate

router = APIRouter()

@router.post("/papers", response_model=Paper)
def upload_paper(paper: PaperCreate, db: Session = Depends(get_db)):
    return create_paper(db, paper)