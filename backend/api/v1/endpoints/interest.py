from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ....db.session import get_db
from ....crud.interest import create_interest
from ....crud.user import get_user
from ....schemas.interest import Interest, InterestCreate, InterestInDB

router = APIRouter()


@router.post("/users/{user_id}/interests", response_model=Interest)
async def add_interest(user_id: str, interest: InterestCreate, db: AsyncSession = Depends(get_db)):
    # Check if the user exists
    user = await get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail=f"User with id {user_id} not found")
    
    # Create an InterestInDB instance with both the keyword from the request body and the user_id from the path
    interest_in_db = InterestInDB(**interest.dict(), user_id=user_id)
    return await create_interest(db, interest_in_db)