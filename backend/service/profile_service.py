import os
import sys
import uuid
from typing import List, Dict, Any, Optional
import asyncio
from fastapi import BackgroundTasks, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

# Import analyze module for Google Scholar fetching
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from analyze import analyze_author

# Import models and crud operations
from ..crud.user import update_user, get_user
from ..crud.paper import create_paper
from ..schemas.paper import PaperCreate
from ..schemas.user import UserUpdate

# For vector database operations (Pinecone)
# Note: You will need to install the pinecone-client package
# pip install pinecone-client
try:
    import pinecone
except ImportError:
    print("Warning: pinecone-client not installed. Vector embeddings will not be stored.")

class ProfileService:
    def __init__(self):
        self.tmp_dir = './paperTmp/'
        self.pinecone_initialized = False
        self._init_pinecone()
        
        # Create tmp directory if it doesn't exist
        if not os.path.exists(self.tmp_dir):
            os.makedirs(self.tmp_dir)
    
    def _init_pinecone(self):
        """Initialize Pinecone connection if API key is available"""
        try:
            api_key = os.getenv('PINECONE_API_KEY')
            environment = os.getenv('PINECONE_ENVIRONMENT', 'gcp-starter')
            index_name = os.getenv('PINECONE_INDEX', 'research-embeddings')
            
            if api_key:
                # Update to use the newer Pinecone API
                import pinecone
                
                # Initialize Pinecone with the new API
                pc = pinecone.Pinecone(api_key=api_key)
                
                # Check if the index exists, create it if not
                indexes = [index.name for index in pc.list_indexes()]
                
                if index_name not in indexes:
                    # Create a new index with cosine similarity and 1536 dimensions
                    # Using OpenAI's ada-002 embedding model dimension
                    pc.create_index(
                        name=index_name,
                        dimension=1536,  # OpenAI ada-002 embedding dimension
                        metric="cosine",
                        spec={"serverless": {"cloud": "aws", "region": "us-east-1"}}
                    )
                
                # Get the index
                self.index = pc.Index(index_name)
                self.pinecone_initialized = True
                print(f"Pinecone initialized successfully with index: {index_name}")
            else:
                print("Warning: PINECONE_API_KEY not set. Vector embeddings will not be stored.")
        except Exception as e:
            print(f"Error initializing Pinecone: {str(e)}")
    
    def _create_vector_embedding(self, content_dict: Dict[str, Any], user_id: str = None) -> Optional[str]:
        """Create vector embedding from paper content and store in Pinecone with metadata"""
        if not self.pinecone_initialized:
            return None
            
        try:
            from openai import OpenAI
            
            api_key = os.getenv('OPENAI_API_KEY')
            if not api_key:
                print("Warning: OPENAI_API_KEY not set. Vector embeddings will not be created.")
                return None
            
            # Create text for embedding (excluding author and journal)
            title = content_dict.get('title', '')
            abstract = content_dict.get('abstract', '')
            equipments = ', '.join(content_dict.get('equipments', []))
            reagents = ', '.join(content_dict.get('reagents', []))
            
            embedding_text = f"Title: {title}\nAbstract: {abstract}\nEquipments: {equipments}\nReagents: {reagents}"
                
            client = OpenAI(api_key=api_key)
            response = client.embeddings.create(
                input=embedding_text,
                model="text-embedding-ada-002"  # or your preferred model
            )
            
            embedding = response.data[0].embedding
            
            # Generate a new UUID for this vector
            vector_id = str(uuid.uuid4())
            
            # Create metadata (excluding author and journal)
            metadata = {
                "title": title,
                "abstract": abstract,
                "equipments": content_dict.get('equipments', []),
                "reagents": content_dict.get('reagents', [])
            }
            
            # Add user_id to metadata if available
            if user_id:
                metadata["user_id"] = user_id
                
            # Upsert the vector with metadata into Pinecone
            self.index.upsert(
                vectors=[
                    {
                        "id": vector_id, 
                        "values": embedding,
                        "metadata": metadata
                    }
                ]
            )
            
            return vector_id
        except Exception as e:
            print(f"Error creating vector embedding: {str(e)}")
            return None
    
    async def create_profile(self, user_id: str, max_papers: int = 5, db: AsyncSession = None) -> Dict[str, Any]:
        """Process user profile creation by fetching Google Scholar data and storing in DB"""
        try:
            # Get user from database to get google_scholar_id
            user = await get_user(db, user_id)
            if not user:
                raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")
                
            google_scholar_id = user.google_scholar_id
            if not google_scholar_id:
                raise HTTPException(status_code=400, detail="User does not have a Google Scholar ID")
            
            # Get paper contents from Google Scholar (non-async)
            paper_contents = analyze_author(google_scholar_id, max_download=max_papers)
            
            if not paper_contents or len(paper_contents) == 0:
                return {"status": "error", "message": "No papers found or error fetching papers", "paper_count": 0}
            
            paper_count = len(paper_contents)
            
            # Process each paper and store in database
            if db:
                for content in paper_contents:
                    if content:  # Skip None values
                        vector_id = None
                        
                        if self.pinecone_initialized:
                            # Create vector embedding and store in Pinecone with metadata
                            vector_id = self._create_vector_embedding(content, user_id)
                        
                        # Create paper record in database
                        paper_data = PaperCreate(
                            user_id=user_id,
                            title=content.get('title', 'Untitled'),
                            abstract=content.get('abstract', ''),
                            authors=content.get('authors', ['Unknown']),  # Provide default value
                            year=content.get('year'),  # Extract the year from parsed data
                            journal=content.get('journal', ''),  # Provide default value
                            doi=content.get('doi'),  # Extract the DOI from parsed data
                            equipments=content.get('equipments', []),
                            reagents=content.get('reagents', []),
                            vector_embedding_id=vector_id
                        )
                        
                        await create_paper(db, paper_data)
                
                # Update user's vector_embedding_id with the latest paper's vector_id if available
                if paper_contents and self.pinecone_initialized:
                    latest_content = paper_contents[-1]
                    if latest_content:
                        vector_id = self._create_vector_embedding(latest_content, user_id)
                        
                        if vector_id:
                            user_update = UserUpdate(vector_embedding_id=uuid.UUID(vector_id))
                            await update_user(db, user_id, user_update)
            
            return {
                "status": "success",
                "message": f"Successfully processed {paper_count} papers from Google Scholar",
                "paper_count": paper_count
            }
            
        except HTTPException as he:
            raise he
        except Exception as e:
            print(f"Error in create_profile: {str(e)}")
            return {"status": "error", "message": f"Error processing profile: {str(e)}", "paper_count": 0}

async def process_profile_creation_background(
    user_id: str,
    max_papers: int,
    db: AsyncSession
) -> None:
    """Background task to process profile creation"""
    service = ProfileService()
    await service.create_profile(user_id, max_papers, db)