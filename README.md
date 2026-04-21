# PhishGuard — AI Email Phishing Detection System

A complete end-to-end Machine Learning web application designed to detect phishing emails with high accuracy. This project utilizes a fine-tuned BERT (Bidirectional Encoder Representations from Transformers) deep learning model for Natural Language Processing (NLP), served via a high-performance FastAPI backend, and presented through a modern, responsive, and dynamic Vanilla HTML/CSS/JS frontend.

---

## 🌟 Features

- **Deep Learning Text Analysis:** Uses a PyTorch-based fine-tuned BERT model to accurately classify emails as `PHISHING` or `BENIGN`.
- **High Performance API:** Powered by FastAPI, ensuring fully asynchronous, fast, and robust API endpoints.
- **Modern User Interface:** A premium dark-mode UI with glassmorphism effects, live dynamic data rendering, and smooth micro-animations.
- **Real-Time Confidence Scoring:** Provides exact probability metrics on how the model scored the email text.
- **Fully Local & Private:** All data processing and inference occurs locally. No API keys to third-party services are required, ensuring zero data leakage.

---

## 🛠️ Technology Stack

**Machine Learning & Backend:**
- Python 3.11+
- [PyTorch](https://pytorch.org/) & [HuggingFace Transformers](https://huggingface.co/transformers/) (Model Inference & Training)
- [FastAPI](https://fastapi.tiangolo.com/) & Uvicorn (Backend Web Framework)
- Pandas & Scikit-Learn (Data manipulation & Evaluation)

**Frontend:**
- Vanilla HTML5 & CSS3 (Custom Design System, CSS Variables, Glassmorphism)
- Vanilla JavaScript (ES6, Fetch API, DOM Manipulation)

---

## 📁 Project Structure

```text
Email Phishing System/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py               # FastAPI application setup and endpoints
│   │   ├── models_loader.py      # Caches and loads the Transformers model into memory
│   │   └── predictors.py         # Handles text tokenization and model inference logic
│   └── models/
│       └── text/
│           └── bert_finetuned/   # The saved PyTorch finetuned BERT model (tokenizer + weights)
│
├── frontend/
│   ├── index.html                # Main interface and structure
│   ├── style.css                 # Custom aesthetic styling and animations
│   └── app.js                    # UI logic, backend API integration, dynamic gauge updates
│
├── ml/
│   ├── eval_text.py              # Script used for evaluating the deployed model
│   └── train_text.py             # Script used for the initial model fine-tuning
│
├── data/                         # Datasets used for model training/evaluation
├── requirements.txt              # Project Python dependencies
└── README.md                     # You are here
```

---

## 🚀 Setup & Launch Instructions

Follow these instructions to run the application on your local machine.

### 1. Prerequisites
- **Python 3.10+** must be installed.
- Ensure you have [Git](https://git-scm.com/) installed if you plan on cloning.
- GPU with CUDA support is recommended for fast model inference, but CPU is also supported and will be automatically selected if a GPU isn't found.

### 2. Environment Setup

It is highly recommended to use a Python virtual environment to manage dependencies. Open a terminal in the root directory (`Email Phishing System/`) and run:

```bash
# Create a virtual environment named "venv"
python -m venv venv

# Activate the virtual environment
# On Windows:
.\venv\Scripts\activate
# On MacOS/Linux:
source venv/bin/activate

# Install the required packages
pip install -r requirements.txt
```

### 3. Launching the Backend API

Make sure your terminal is at the **root of the project** (`Email Phishing System/`), and your `venv` is activated.

```bash
# Start the FastAPI server using Uvicorn
python -m uvicorn backend.app.main:app --port 8000 --reload
```

> **Note on Navigation Error:** If you navigate into the `backend/` folder (`cd backend`) before running that command, Python will throw a `ModuleNotFoundError`. For it to work from *inside* the backend folder, you must drop `backend.` from the command and run: `python -m uvicorn app.main:app --port 8000 --reload`

Once running, you should see the startup message and your model loading into memory. You can verify the API is alive by visiting the interactive Swagger documentation at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 4. Launching the Frontend Application

You do not need a web server to run the frontend! Because it is fully vanilla HTML/vanilla JS, you can run it directly from your file system.

1. Open your file explorer.
2. Navigate to the `frontend/` folder.
3. Double-click the `index.html` file to open it in Chrome, Edge, Firefox, or Safari.

*(Alternatively, you can just use `start frontend/index.html` on Windows from the root project folder).*

The page will load, and the top navigation bar will say **API Connected** with a green dot if it successfully communicates with your local backend.

---

## 🧪 Testing the Model

1. On the frontend, copy and paste an email you wish to test.
   **Example Phishing Prompt:**
   > *"URGENT: Your bank account will be closed in 12 hours due to irregular activity. Please click here to verify your details immediately to avoid suspension."*
2. Click **Analyze Email**.
3. View the generated breakdown of Phishing vs. Benign confidence ratings on the resulting visual dashboard.

---

## 📄 API Documentation

The FastAPI backend automatically generates standard OpenAPI documentation. While the backend is running, you can access the definitions and test the endpoints natively via:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

**Primary Endpoint:**
- `POST /api/text_check`
  - Body: `{"text": "email string contents"}`
  - Response: `{"label": "PHISHING | BENIGN", "confidence": 0.99, "probs": {"phishing": 0.99, "benign": 0.01}}`

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome. Feel free to check the issues page if you want to contribute.

## ⚖️ License
This project is for educational and security-research purposes.
