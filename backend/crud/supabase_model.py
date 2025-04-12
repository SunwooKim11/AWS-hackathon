import os
from supabase import create_client, Client

# Supabase 클라이언트 초기화
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

def save_model_to_supabase(model_name: str, model_data: bytes):
    """Save a model to Supabase storage."""
    try:
        response = supabase.storage.from_("models").upload(f"{model_name}.bin", model_data)
        print("Model saved successfully:", response)
    except Exception as e:
        print("Error saving model to Supabase:", e)

def get_model_from_supabase(model_name: str) -> bytes:
    """Retrieve a model from Supabase storage."""
    try:
        response = supabase.storage.from_("models").download(f"{model_name}.bin")
        print("Model retrieved successfully")
        return response
    except Exception as e:
        print("Error retrieving model from Supabase:", e)
        return None