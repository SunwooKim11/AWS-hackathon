from sqlalchemy.orm import Session
from ..models.paper import Paper
from ..schemas.paper import PaperCreate

def create_paper(db: Session, paper: PaperCreate):
    db_paper = Paper(**paper.dict())
    db.add(db_paper)
    db.commit()
    db.refresh(db_paper)
    return db_paper