from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ....db.session import get_db
from ....crud.tool import create_tool
from ....schemas.tool import Tool, ToolCreate

router = APIRouter()


@router.post("/users/{user_id}/tools", response_model=Tool)
def add_tool(user_id: str, tool: ToolCreate, db: AsyncSession = Depends(get_db)):
    tool.user_id = user_id
    return create_tool(db, tool)