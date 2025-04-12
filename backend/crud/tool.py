from sqlalchemy.orm import Session
from ..models.tool import Tool
from ..schemas.tool import ToolCreate

def create_tool(db: Session, tool: ToolCreate):
    db_tool = Tool(**tool.dict())
    db.add(db_tool)
    db.commit()
    db.refresh(db_tool)
    return db_tool