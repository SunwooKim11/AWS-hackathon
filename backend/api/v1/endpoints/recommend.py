from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ....db.session import get_db
from ....service.recommender import Recommender
import os
from dotenv import load_dotenv
from typing import List, Dict, Any
from ....schemas.user import UserRequest
import json
from pathlib import Path
import random

router = APIRouter()

# 추천 시스템 인스턴스 생성
recommender = Recommender()

# 더미 데이터
DUMMY_DATA = [
  {
    "user_id": "user1",
    "papers": [
      {
        "title": "줄기세포 재생 메커니즘",
        "abstract": "신호전달 기전 탐색",
        "year": 2023,
        "journal": "Neuroscience Research",
        "doi": "10.8093/abc.299",
        "authors": [
          "조생명",
          "장백신",
          "박세포"
        ],
        "equipments": [
          "형광현미경",
          "오실로스코프",
          "원심분리기",
          "PCR머신"
        ],
        "reagents": [
          "FBS",
          "트립신",
          "항체"
        ],
        "vector_embedding_id": None,
        "score": 0.85
      }
    ]
  },
  {
    "user_id": "user2",
    "papers": [
      {
        "title": "면역세포 활성화와 면역억제 연구",
        "abstract": "세포 경로 및 조절 메커니즘 규명",
        "year": 2025,
        "journal": "Biochemical Journal",
        "doi": None,
        "authors": [
          "이신경",
          "홍길동"
        ],
        "equipments": [
          "유세포분석기",
          "원심분리기",
          "마이크로매니퓰레이터"
        ],
        "reagents": [
          "프라이머",
          "사이토카인",
          "DNA 벡터"
        ],
        "vector_embedding_id": "vec_d60d4a35",
        "score": 0.75
      }
    ]
  },
  {
    "user_id": "user3",
    "papers": [
      {
        "title": "백신 면역 반응 분석",
        "abstract": "세포 경로 및 조절 메커니즘 규명",
        "year": 2021,
        "journal": "Neuroscience Research",
        "doi": None,
        "authors": [
          "윤분자",
          "홍길동"
        ],
        "equipments": [
          "유세포분석기",
          "마이크로매니퓰레이터"
        ],
        "reagents": [
          "트립신",
          "DNA 벡터"
        ],
        "vector_embedding_id": None,
        "score": 0.65
      }
    ]
  }
]

@router.post("/recommendations")
async def get_recommendations(request: UserRequest) -> List[Dict[str, Any]]:
    try:
        recommendations = recommender.get_recommendations(request.user_id)
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search")
async def search_recommendations(query: str = Query(..., description="검색 쿼리")) -> List[Dict[str, Any]]:
    try:
        print(f"검색 쿼리: {query}")
        
        # 키워드 기반 간단한 매칭
        keywords = query.lower().split()
        results = []
        
        for user in DUMMY_DATA:
            for paper in user["papers"]:
                title = paper.get("title", "").lower()
                abstract = paper.get("abstract", "").lower()
                
                # 키워드 매칭 점수 계산
                score = 0
                for keyword in keywords:
                    if keyword in title:
                        score += 0.6
                    if keyword in abstract:
                        score += 0.4
                
                if score > 0:
                    # 원본 데이터 구조 유지하면서 score 추가
                    paper_with_score = paper.copy()
                    paper_with_score["score"] = min(score, 1.0)
                    results.append({
                        "user_id": user["user_id"],
                        "papers": [paper_with_score]
                    })
        
        # 점수 기준으로 정렬하고 상위 5개만 반환
        results.sort(key=lambda x: x["papers"][0]["score"], reverse=True)
        results = results[:5]
        
        # 결과가 없으면 랜덤 추천
        if not results:
            random_users = random.sample(DUMMY_DATA, min(3, len(DUMMY_DATA)))
            results = []
            for user in random_users:
                if user["papers"]:
                    paper = random.choice(user["papers"])
                    paper_with_score = paper.copy()
                    paper_with_score["score"] = random.uniform(0.3, 0.7)
                    results.append({
                        "user_id": user["user_id"],
                        "papers": [paper_with_score]
                    })
        
        print(f"검색 결과: {results}")
        return results
    except Exception as e:
        print(f"검색 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(router, host="0.0.0.0", port=8000)