# backend/app/predictors.py
from typing import Optional, Dict
import torch
from .models_loader import DEVICE


def predict_text_probs(tokenizer, model, text: Optional[str]) -> Optional[Dict[str, float]]:
    """Tokenise input text, run BERT inference, return benign/phishing probabilities."""
    if not text or not text.strip():
        return None

    enc = tokenizer(
        text,
        truncation=True,
        padding="max_length",
        max_length=256,
        return_tensors="pt",
    )
    enc = {k: v.to(DEVICE) for k, v in enc.items()}

    with torch.no_grad():
        logits = model(**enc).logits
        probs = torch.softmax(logits, dim=1)[0].cpu().numpy().tolist()

    if len(probs) >= 2:
        return {"benign": round(float(probs[0]), 4), "phishing": round(float(probs[1]), 4)}
    return {"benign": round(float(probs[0]), 4), "phishing": 0.0}
