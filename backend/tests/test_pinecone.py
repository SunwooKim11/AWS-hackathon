import os
import sys
from dotenv import load_dotenv
import json

# Load environment variables from .env file
load_dotenv("backend/.env")  # Specify the correct path to the .env file

# Add the project root to Python path to import ProfileService
sys.path.append(os.path.abspath("."))
from backend.service.profile_service import ProfileService

def test_pinecone_embedding():
    """Test function to directly test Pinecone vector embedding"""
    print("Starting Pinecone test...")
    
    # Create an instance of ProfileService
    service = ProfileService()
    
    if not service.pinecone_initialized:
        print("ERROR: Pinecone is not initialized. Check your Pinecone API key.")
        return False
    
    # Sample paper content similar to what would be extracted from a research paper
    test_content = {
        "title": "Test Paper for Pinecone Integration",
        "abstract": "This is a test paper to verify that Pinecone vector embeddings are working correctly.",
        "equipments": ["Test Equipment 1", "Test Equipment 2"],
        "reagents": ["Test Reagent 1", "Test Reagent 2"],
        "authors": ["Test Author"],
        "journal": "Test Journal",
        "year": 2025
    }
    
    # Try to create a vector embedding
    print("Attempting to create vector embedding in Pinecone...")
    vector_id = service._create_vector_embedding(test_content, "test_user_id")
    
    if vector_id:
        print(f"SUCCESS: Vector embedding created successfully! Vector ID: {vector_id}")
        
        # Verify that the vector exists in Pinecone by querying it
        try:
            print("Verifying vector in Pinecone...")
            # Query the index to see if the vector exists - updated for new Pinecone API
            query_response = service.index.query(
                id=vector_id,
                top_k=1,
                include_metadata=True
            )
            
            print(f"Query response: {json.dumps(query_response, indent=2)}")
            return True
        except Exception as e:
            print(f"Error querying Pinecone: {str(e)}")
            return False
    else:
        print("ERROR: Failed to create vector embedding in Pinecone.")
        return False

if __name__ == "__main__":
    success = test_pinecone_embedding()
    print(f"Test {'passed' if success else 'failed'}")