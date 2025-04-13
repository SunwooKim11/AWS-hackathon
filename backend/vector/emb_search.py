from pinecone import Pinecone
import os
import numpy as np
import openai
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()
print("\n🔥 PINCONE_API_KEY 로드됨?:", os.getenv("PINCONE_API_KEY"))
print("\n🔥 OPENAI_API_KEY 로드됨?:", os.getenv("OPENAI_API_KEY"))

# OpenAI API 키 설정
openai.api_key = os.getenv("OPENAI_API_KEY")

# Pinecone 초기화
pc = Pinecone(api_key=os.getenv("PINCONE_API_KEY"))
index_name = "bio-paper-index"

# 기존 인덱스 사용
if index_name in pc.list_indexes().names():
    print(f"✅ 기존 인덱스 '{index_name}'를 사용합니다.")
    index = pc.Index(index_name)
    print("🧠 인덱스 상태:", index.describe_index_stats())
else:
    print(f"⚠️ 인덱스 '{index_name}'가 존재하지 않습니다. 검색을 진행할 수 없습니다.")
    exit(1)

def get_embedding(text: str) -> list:
    """OpenAI API를 사용하여 텍스트의 임베딩을 얻습니다."""
    response = openai.Embedding.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

def get_recommendations(query_text, top_k=5):
    """쿼리 텍스트에 대한 추천을 반환합니다."""
    if not query_text.strip():
        print("🚨 유효한 쿼리 텍스트 없음!")
        return []

    # 쿼리 텍스트의 임베딩 생성
    query_vector = get_embedding(query_text)
    print(f"🧪 벡터 평균: {np.mean(query_vector):.4f}, 분산: {np.var(query_vector):.4f}")

    # Pinecone에서 유사한 벡터 검색
    results = index.query(vector=query_vector, top_k=top_k, include_metadata=True)

    print(f"📊 유사한 문서 {len(results.matches)}개 발견")
    recommended_users = []
    for match in results.matches:
        user_id = match.metadata.get("user_id")
        print(f"✅ 추천: {user_id} | 제목: {match.metadata.get('title')} | score: {match.score:.4f}")
        if user_id not in recommended_users:
            recommended_users.append(user_id)

    return recommended_users

if __name__ == "__main__":
    # 검색 테스트
    queries = ["신경세포", "줄기세포", "세포", "면역", "단백질", "DNA"]
    for q in queries:
        print("\n" + "="*60)
        print(f"쿼리 테스트: {q}")
        result = get_recommendations(q)
        print(f"🔗 추천된 사용자: {result}")