from sqlalchemy.orm import Session
from ..models.tool import Tool
from ..schemas.tool import ToolCreate

def create_tool(db: Session, tool: ToolCreate):
    # Save to local database using SQLAlchemy
    db_tool = Tool(**tool.dict())
    db.add(db_tool)
    db.commit()
    db.refresh(db_tool)

    # Removed Supabase saving logic

    return db_tool