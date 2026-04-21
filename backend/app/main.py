# backend/app/main.py
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .models_loader import load_text_model, get_cache_keys, DEVICE
from .predictors import predict_text_probs

# ── Config ────────────────────────────────────────────────
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
TEXT_MODEL_DIR = os.path.join(BASE_DIR, "backend", "models", "text", "bert_finetuned")

# ── FastAPI app ───────────────────────────────────────────
app = FastAPI(title="Email Phishing Detection API")


@app.on_event("startup")
async def startup_event():
    print("=" * 50)
    print("Email Phishing Detection API starting up...")
    print(f"  Device  : {DEVICE}")
    print(f"  Model   : {TEXT_MODEL_DIR}")
    print(f"  Docs    : http://localhost:8000/docs")
    print("=" * 50)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request / Response schemas ────────────────────────────
class TextCheckRequest(BaseModel):
    text: str


# ── Endpoints ─────────────────────────────────────────────
@app.get("/api/status")
def status():
    return {"ok": True, "device": str(DEVICE), "models_cached": get_cache_keys()}


@app.post("/api/text_check")
def text_check(req: TextCheckRequest):
    try:
        tokenizer, model = load_text_model(TEXT_MODEL_DIR)
        probs = predict_text_probs(tokenizer, model, req.text)

        if not probs:
            return {"error": "Empty or invalid text provided."}

        label = "PHISHING" if probs["phishing"] > probs["benign"] else "BENIGN"
        confidence = max(probs["phishing"], probs["benign"])

        return {
            "label": label,
            "confidence": round(confidence, 4),
            "probs": probs,
        }
    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}
