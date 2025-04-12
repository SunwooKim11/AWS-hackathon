from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....db.session import get_db
from ....service.recommender import Recommender
import os
from dotenv import load_dotenv
from typing import List, Dict, Any
from ....schemas.user import UserRequest

router = APIRouter()

# 추천 시스템 인스턴스 생성
recommender = Recommender()

@router.post("/recommendations")
async def get_recommendations(request: UserRequest) -> List[Dict[str, Any]]:
    try:
        recommendations = recommender.get_recommendations(request.user_id)
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(router, host="0.0.0.0", port=8000)