from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from models import ResearchData, RecommendationRequest, RecommendationResponse
from recommender import Recommender
import os
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

app = FastAPI(title="Research Recommendation System")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 추천 시스템 인스턴스 생성
recommender = Recommender()

class UserRequest(BaseModel):
    user_id: str

@app.get("/")
async def root():
    return {"message": "Research Recommendation System API"}

@app.post("/research")
async def add_research(research_data: ResearchData):
    """새로운 연구 데이터를 추가"""
    try:
        # 연구 데이터를 벡터로 변환
        research_vector = recommender.create_vectors(research_data)
        # 벡터 DB에 저장
        recommender.upsert_research(research_vector)
        return {"message": "Research data added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommendations")
async def get_recommendations(request: UserRequest) -> List[Dict[str, Any]]:
    try:
        recommendations = recommender.get_recommendations(request.user_id)
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/similar-users")
async def get_similar_users(request: UserRequest) -> List[Dict[str, Any]]:
    try:
        similar_users = recommender.get_similar_users(request.user_id)
        return similar_users
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 