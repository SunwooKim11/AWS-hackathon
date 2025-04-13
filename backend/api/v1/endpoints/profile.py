from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ....db.session import get_db
from ....schemas.profile import ProfileCreateRequest, ProfileCreateResponse
from ....service.profile_service import process_profile_creation_background
from ....crud.user import get_user

router = APIRouter()

@router.post("/create-profile", response_model=ProfileCreateResponse)
async def create_profile(
    profile_request: ProfileCreateRequest, 
    background_tasks: BackgroundTasks, 
    db: AsyncSession = Depends(get_db)
):
    """
    Create user profile by processing Google Scholar data.
    This is an asynchronous endpoint that starts the processing in the background.
    """
    # Check if user exists
    user = await get_user(db, profile_request.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Start the background task
    background_tasks.add_task(
        process_profile_creation_background,
        profile_request.user_id,
        profile_request.max_papers,
        db
    )
    
    return {
        "message": f"Profile creation initiated for user {profile_request.user_id}. Processing {profile_request.max_papers} papers from Google Scholar.",
        "status": "processing",
        "paper_count": 0
    }