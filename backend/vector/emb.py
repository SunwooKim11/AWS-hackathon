from pinecone import Pinecone, ServerlessSpec
import json
from pathlib import Path
from tqdm import tqdm
from dotenv import load_dotenv
import os
import re
import numpy as np
from openai import OpenAI

load_dotenv()
print("\n🔥 PINCONE_API_KEY 로드됨?:", os.getenv("PINCONE_API_KEY"))
print("\n🔥 OPENAI_API_KEY 로드됨?:", os.getenv("OPENAI_API_KEY"))

# OpenAI 클라이언트 초기화
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Pinecone 초기화
pc = Pinecone(api_key=os.getenv("PINCONE_API_KEY"))
index_name = "bio-paper-index"

if index_name in pc.list_indexes().names():
    pc.delete_index(index_name)

pc.create_index(
    name=index_name,
    dimension=1536,  # OpenAI text-embedding-3-small 모델의 차원
    metric="cosine",
    spec=ServerlessSpec(cloud="aws", region="us-east-1")
)

index = pc.Index(index_name)

# 데이터 로드
json_path = Path(__file__).parent.parent / 'data' / 'bio_research_nested.json'
with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

def sanitize_id(raw_id: str) -> str:
    return re.sub(r"[^a-zA-Z0-9_\-]", "_", raw_id)[:64]

def get_embedding(text: str) -> list:
    """OpenAI API를 사용하여 텍스트의 임베딩을 얻습니다."""
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

print("\n📦 벡터 생성 및 업로드 중...")
vectors_to_upsert = []
vector_count = 0

for user in tqdm(data, desc="사용자 처리 중"):
    user_id = user["user_id"]
    for paper in user["papers"]:
        # 논문 텍스트 준비
        text = (paper.get("title", "") + "\n" + paper.get("abstract", "") + "\n" +
                " ".join(paper.get("equipments", [])) + "\n" + " ".join(paper.get("reagents", [])))
        
        if not text.strip():
            continue
            
        # 임베딩 생성
        vector = get_embedding(text)
        
        # ID 생성
        raw_id = f"{user_id}_{paper['title'][:50].strip()}"
        doc_id = sanitize_id(raw_id)
        
        # 메타데이터 준비
        metadata = {
            "user_id": user["user_id"],
            "title": paper.get("title", ""),
            "abstract": paper.get("abstract", ""),
            "year": paper.get("year", ""),
            "journal": paper.get("journal", ""),
            "equipments": paper.get("equipments", []),
            "reagents": paper.get("reagents", [])
        }
        
        vectors_to_upsert.append({
            "id": doc_id,
            "values": vector,
            "metadata": metadata
        })
        vector_count += 1
        
        if len(vectors_to_upsert) >= 10:
            index.upsert(vectors=vectors_to_upsert)
            print(f"\n📊 중간 상태 - 현재까지 업로드된 벡터 수: {vector_count}")
            print("🧠 현재 인덱스 상태:", index.describe_index_stats())
            vectors_to_upsert = []

if vectors_to_upsert:
    index.upsert(vectors=vectors_to_upsert)
    print(f"\n📊 중간 상태 - 현재까지 업로드된 벡터 수: {vector_count}")
    print("🧠 현재 인덱스 상태:", index.describe_index_stats())

print(f"\n✅ 총 {vector_count}개의 벡터가 Pinecone에 업로드되었습니다.")
print("\n🧠 최종 인덱스 상태:", index.describe_index_stats())

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
    queries = ["신경세포", "줄기세포", "세포", "면역", "단백질", "DNA"]
    for q in queries:
        print("\n" + "="*60)
        print(f"쿼리 테스트: {q}")
        result = get_recommendations(q)
        print(f"🔗 추천된 사용자: {result}")