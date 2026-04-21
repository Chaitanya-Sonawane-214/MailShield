# backend/app/models_loader.py
import os
import torch
from transformers import BertTokenizerFast, BertForSequenceClassification

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

_CACHE = {}


def load_text_model(text_dir: str):
    """Load BERT text classifier from local directory with caching."""
    key = f"text::{text_dir}"
    if key in _CACHE:
        return _CACHE[key]

    abs_dir = os.path.abspath(text_dir)
    print(f"Loading text model from: {abs_dir}")

    if not os.path.isdir(abs_dir):
        raise ValueError(f"[ERROR] Text model directory does NOT exist: {abs_dir}")

    try:
        tokenizer = BertTokenizerFast.from_pretrained(abs_dir, local_files_only=True)
        model = BertForSequenceClassification.from_pretrained(
            abs_dir, local_files_only=True
        ).to(DEVICE)
        model.eval()

        _CACHE[key] = (tokenizer, model)
        print(f"[OK] Text model loaded successfully from: {abs_dir}")
        return tokenizer, model
    except Exception as e:
        print(f"[FAIL] Failed to load text model: {str(e)}")
        raise ValueError(f"Failed to load text model from {abs_dir}: {str(e)}")


def get_cache_keys():
    return list(_CACHE.keys())
