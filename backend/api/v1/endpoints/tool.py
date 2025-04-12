from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....db.session import SessionLocal
from ....crud.tool import create_tool
from ....schemas.tool import Tool, ToolCreate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/users/{user_id}/tools", response_model=Tool)
def add_tool(user_id: str, tool: ToolCreate, db: Session = Depends(get_db)):
    tool.user_id = user_id
    return create_tool(db, tool)