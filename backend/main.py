from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.v1.endpoints import user, tool, paper, interest, current_study, recommend, profile
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))


app = FastAPI(title="AWS Hackathon Backend", version="1.0.0")

# CORS settings
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user.router, prefix="/api/v1")
app.include_router(tool.router, prefix="/api/v1")
app.include_router(paper.router, prefix="/api/v1")
app.include_router(interest.router, prefix="/api/v1")
app.include_router(current_study.router, prefix="/api/v1")
app.include_router(recommend.router, prefix="/api/v1")
app.include_router(profile.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to the AWS Hackathon Backend!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}