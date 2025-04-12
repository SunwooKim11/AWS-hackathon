from pydantic import BaseModel

class InterestBase(BaseModel):
    user_id: str
    keyword: str

class InterestCreate(InterestBase):
    pass

class Interest(InterestBase):
    id: str
    created_at: str

    class Config:
        orm_mode = True