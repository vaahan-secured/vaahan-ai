from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Vaahan AI backend is running"}

# ✅ New AI Chatbot endpoint
@app.get("/chat")
def chat(message: str = Query(..., description="User message to AI")):
    """
    Simple demo AI chatbot endpoint.
    In real MVP, you can replace this with OpenAI / local AI model calls.
    """
    # Very basic mock response for testing
    user_msg = message.strip()
    if not user_msg:
        return {"response": "Please say something!"}
    
    # Mock AI logic
    response = f"Echo: {user_msg} (This is your AI chatbot responding!)"
    return {"response": response}

