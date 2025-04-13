from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ....db.session import get_db
from ....service.recommender import Recommender
import os
from dotenv import load_dotenv
from typing import List, Dict, Any
from ....schemas.user import UserRequest
import sys
import os
import json

# 벡터 모듈 경로 추가
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))
from vector.emb_search import get_recommendations as vector_search

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

@router.get("/search")
async def search_papers(query: str = Query(..., description="검색어"), top_k: int = Query(5, description="반환할 결과 수")) -> List[Dict[str, Any]]:
    """
    유사한 연구를 하는 연구자를 검색합니다.
    
    Args:
        query: 검색어
        top_k: 반환할 결과 수
        
    Returns:
        검색된 연구자 목록
    """
    try:
        print(f"\n🔍 검색 쿼리: {query}")
        
        # 벡터 검색 수행
        user_ids = vector_search(query, top_k=top_k)
        print(f"✨ 벡터 검색 결과 user_ids: {user_ids}")
        
        # 사용자 정보 가져오기
        results = []
        
        # 사용자 데이터 로드
        current_dir = os.path.dirname(os.path.abspath(__file__))
        data_path = os.path.join(current_dir, '../../../data/bio_research_nested.json')
        print(f"📂 데이터 파일 경로: {data_path}")
        
        with open(data_path, 'r', encoding='utf-8') as f:
            users_data = json.load(f)
        
        # 사용자 ID를 키로 하는 딕셔너리 생성
        users_dict = {user['user_id']: user for user in users_data}
        print(f"📚 로드된 전체 사용자 수: {len(users_dict)}")
        
        # 검색 결과 생성
        for user_id in user_ids:
            print(f"\n👤 처리 중인 user_id: {user_id}")
            if user_id in users_dict:
                user = users_dict[user_id]
                print(f"✅ 사용자 정보 찾음: {user.get('user_id')}")
                
                # 결과에 사용자 정보 추가
                results.append({
                    "user_id": user_id,
                    "name": f"연구자 {user_id}",
                    "affiliation": "대학/연구소",
                    "google_scholar_id": user.get('google_scholar_id', ''),
                    "linkedin": user.get('linkedin', ''),
                    "papers": user.get('papers', [])[:3]  # 최근 논문 3개만 포함
                })
            else:
                print(f"⚠️ 사용자 정보를 찾을 수 없음: {user_id}")
        
        print(f"\n🎯 최종 검색 결과 수: {len(results)}")
        print("\n📋 검색 결과:")
        for idx, result in enumerate(results, 1):
            print(f"\n[결과 {idx}]")
            print(f"🆔 User ID: {result['user_id']}")
            print(f"👤 이름: {result['name']}")
            print(f"🏢 소속: {result['affiliation']}")
            if result.get('papers'):
                print(f"📚 논문 수: {len(result['papers'])}")
                for paper in result['papers'][:2]:  # 처음 2개 논문만 출력
                    print(f"   - {paper.get('title', '제목 없음')}")
            print("-------------------")
        
        return results
    except Exception as e:
        print(f"❌ 오류 발생: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(router, host="0.0.0.0", port=8000)