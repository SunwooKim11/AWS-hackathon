import os
from typing import List, Dict, Any
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json

class Recommender:
    def __init__(self):
        self.users = []
        self.user_vectors = None
        self.vectorizer = None
        self.vector_dim = 100  # 임베딩 차원
        self.load_users()  # 초기화 시 바로 데이터 로드

    def load_users(self):
        """사용자 데이터 로드"""
        try:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            data_path = os.path.join(current_dir, 'data', 'users.json')
            print(f"Loading data from: {data_path}")  # 디버깅용
            
            with open(data_path, 'r', encoding='utf-8') as f:
                self.users = json.load(f)
            print(f"Loaded {len(self.users)} users")  # 디버깅용
            self._create_user_vectors()
        except Exception as e:
            print(f"Error loading users: {str(e)}")  # 디버깅용
            self.users = []
            self.user_vectors = None

    def _create_user_vectors(self):
        """사용자 프로필을 벡터로 변환"""
        if not self.users:
            return

        # 각 사용자의 프로필을 하나의 문자열로 결합
        user_profiles = []
        for user in self.users:
            profile = f"{user.get('abstract', '')} {' '.join(user.get('equipment', []))} {' '.join(user.get('reagents', []))}"
            user_profiles.append(profile)

        # TF-IDF 기반 벡터화
        self.vectorizer = TfidfVectorizer(max_features=self.vector_dim)
        self.user_vectors = self.vectorizer.fit_transform(user_profiles)
        print(f"Created vectors with shape: {self.user_vectors.shape}")  # 디버깅용

    def get_recommendations(self, user_id: str, n_recommendations: int = 5) -> List[Dict[str, Any]]:
        """사용자 기반 추천"""
        if not self.users or self.user_vectors is None:
            self.load_users()

        # 현재 사용자 찾기
        current_user_idx = None
        for i, user in enumerate(self.users):
            if user['user_id'] == user_id:
                current_user_idx = i
                break

        if current_user_idx is None:
            print(f"User {user_id} not found")  # 디버깅용
            return []

        # 현재 사용자와 다른 모든 사용자 간의 유사도 계산
        current_user_vector = self.user_vectors[current_user_idx]
        similarities = cosine_similarity(current_user_vector, self.user_vectors).flatten()

        # 자기 자신을 제외하고 가장 유사한 사용자들의 인덱스 찾기
        similar_indices = np.argsort(similarities)[::-1][1:n_recommendations+1]

        # 추천 결과 생성
        recommendations = []
        for idx in similar_indices:
            recommendations.append({
                'user_id': self.users[idx]['user_id'],
                'similarity_score': float(similarities[idx]),
                'abstract': self.users[idx].get('abstract', ''),
                'equipment': self.users[idx].get('equipment', []),
                'reagents': self.users[idx].get('reagents', [])
            })

        return recommendations

    def get_similar_users(self, user_id: str, n_similar: int = 5) -> List[Dict[str, Any]]:
        """유사한 사용자 찾기"""
        return self.get_recommendations(user_id, n_similar) 