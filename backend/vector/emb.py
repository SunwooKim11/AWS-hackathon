from pinecone import Pinecone, ServerlessSpec
from gensim.models import Doc2Vec
from gensim.models.doc2vec import TaggedDocument
import json
from pathlib import Path
from tqdm import tqdm
from dotenv import load_dotenv
import os
from soynlp.tokenizer import LTokenizer
from soynlp.word import WordExtractor
import re
import numpy as np

load_dotenv()
print("\n🔥 PINCONE_API_KEY 로드됨?:", os.getenv("PINCONE_API_KEY"))

# Pinecone 초기화
pc = Pinecone(api_key=os.getenv("PINCONE_API_KEY"))
index_name = "bio-paper-index"

if index_name in pc.list_indexes().names():
    pc.delete_index(index_name)

pc.create_index(
    name=index_name,
    dimension=100,
    metric="cosine",
    spec=ServerlessSpec(cloud="aws", region="us-east-1")
)

index = pc.Index(index_name)

# 데이터 로드
json_path = Path(__file__).parent.parent / 'data' / 'bio_research_nested.json'
with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

print("\n📚 soynlp 토크나이저 학습 중...")
text_corpus = [paper.get("title", "") + " " + paper.get("abstract", "")
               for user in data for paper in user["papers"]]

word_extractor = WordExtractor()
word_extractor.train(["\n".join(text_corpus)])
word_scores = word_extractor.extract()

# 토크나이저 초기화
tokenizer = LTokenizer(scores={
    k: float(v.cohesion_forward)
    for k, v in word_scores.items() if v.cohesion_forward
})

def preprocess_text(text: str):
    return tokenizer.tokenize(text.lower())

def sanitize_id(raw_id: str) -> str:
    return re.sub(r"[^a-zA-Z0-9_\-]", "_", raw_id)[:64]

print("\n🛠️ 텍스트 전처리 및 문서 준비 중...")
documents = []
for user in tqdm(data, desc="사용자 처리 중"):
    user_id = user["user_id"]
    for paper in user["papers"]:
        text = (paper.get("title", "") + " " + paper.get("abstract", "") +
                " ".join(paper.get("equipments", [])) + " " + " ".join(paper.get("reagents", [])))
        tokens = preprocess_text(text)
        if not tokens:
            continue
        raw_id = f"{user_id}_{paper['title'][:50].strip()}"
        doc_id = sanitize_id(raw_id)
        documents.append(TaggedDocument(tokens, [doc_id]))

print(f"✅ 총 문서 수: {len(documents)}")

print("\n🤖 Doc2Vec 모델 학습 중...")
model = Doc2Vec(vector_size=100, min_count=2, epochs=20)
model.build_vocab(documents)
model.train(documents, total_examples=model.corpus_count, epochs=model.epochs)

print("\n📦 벡터 생성 및 업로드 중...")
vectors_to_upsert = []
vector_count = 0
for doc in documents:
    doc_id = doc.tags[0]
    vector = model.dv[doc_id]
    # 메타데이터 추적
    for user in data:
        for paper in user["papers"]:
            if doc_id.startswith(f"{user['user_id']}_"):
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
                    "values": vector.tolist(),
                    "metadata": metadata
                })
                vector_count += 1
                break

    if len(vectors_to_upsert) >= 100:
        index.upsert(vectors=vectors_to_upsert)
        vectors_to_upsert = []

if vectors_to_upsert:
    index.upsert(vectors=vectors_to_upsert)

print(f"\n✅ 총 {vector_count}개의 벡터가 Pinecone에 업로드되었습니다.")
print("\n🧠 인덱스 상태:", index.describe_index_stats())

def get_recommendations(query_text, top_k=5):
    tokens = preprocess_text(query_text)
    print(f"\n🔍 쿼리: '{query_text}' → 토큰: {tokens}")
    if not tokens:
        print("🚨 유효한 토큰 없음!")
        return []

    query_vector = model.infer_vector(tokens, epochs=50)
    print(f"🧪 벡터 평균: {np.mean(query_vector):.4f}, 분산: {np.var(query_vector):.4f}")

    results = index.query(vector=query_vector.tolist(), top_k=top_k, include_metadata=True)

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