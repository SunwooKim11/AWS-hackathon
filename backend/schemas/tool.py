from pydantic import BaseModel

class ToolBase(BaseModel):
    user_id: str
    keyword: str

class ToolCreate(ToolBase):
    pass

class Tool(ToolBase):
    id: str
    created_at: str

    class Config:
        orm_mode = True