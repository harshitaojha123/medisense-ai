# 🩺 MediSense AI

## AI-Powered Health Intelligence & Diabetes Risk Screening Platform

MediSense AI is a full-stack healthcare technology platform designed to help users manage health information, explore health trends, upload medical reports, and receive an explainable machine-learning-based diabetes risk screening signal.

The platform combines a modern React frontend, Node.js/Express backend, PostgreSQL database, Python/FastAPI AI service, Random Forest machine-learning model, and SHAP-based explainability into a unified healthcare experience.

> ⚠️ **Medical Disclaimer:** MediSense AI provides educational and decision-support information only. Its diabetes model produces a machine-learning screening signal and is **not a medical diagnosis**. Users should consult qualified healthcare professionals for clinical evaluation and treatment decisions.

---

# 🌐 Live Application

### Frontend
https://medinsense-ai.vercel.app

### Backend API
https://medisense-ai-1-21e3.onrender.com

### AI Service
https://medisense-ai-t5nf.onrender.com

---

# ✨ Features

## 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- Protected routes
- Persistent authentication sessions
- Secure API authorization

---

## 📊 Health Dashboard

MediSense provides a centralized dashboard for viewing health information.

### Dashboard includes

- Health metrics
- Health goals
- Symptoms
- Medical reports
- Recent health activity
- Health-data completeness
- Personalized health context

---

# 📄 Medical Reports

Users can manage their medical reports directly through the application.

### Supported functionality

- Upload medical reports
- View uploaded reports
- Search reports
- Download/view reports
- Delete reports
- Latest report tracking
- Dynamic report statistics
- Loading and error states

### Supported formats

- PDF
- JPG
- JPEG
- PNG
- WEBP

### Maximum upload size


```text
10 MB

User
  │
  ▼
React Frontend
  │
  ▼
Node.js / Express Backend
  │
  ▼
Python / FastAPI AI Service
  │
  ▼
Random Forest Model
  │
  ▼
Risk Screening Signal
  │
  ▼
SHAP Explainability
  │
  ▼
Risk Result + Contributing Factors


Algorithm: Random Forest Classifier
Number of Estimators: 300
Maximum Depth: 12
Minimum Samples per Leaf: 5
Class Weight: Balanced
Random State: 42


RandomForestClassifier(
    n_estimators=300,
    max_depth=12,
    min_samples_leaf=5,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1,
)



Prediction
    │
    ├── Risk Probability
    │
    ├── Risk Band
    │
    └── Top Contributing Factors
             │
             ├── General Health
             ├── High Blood Pressure
             ├── BMI
             ├── Age
             └── High Cholesterol



                         ┌──────────────────┐
                         │       User       │
                         └────────┬─────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │     React + Vite        │
                    │       Frontend          │
                    │        Vercel           │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   Node.js + Express     │
                    │       Backend           │
                    │        Render           │
                    └────────────┬────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
        ┌─────────────┐  ┌──────────────┐  ┌─────────────┐
        │ PostgreSQL  │  │ Python AI    │  │ Healthcare  │
        │    Neon     │  │   Service    │  │  Services   │
        └─────────────┘  │   FastAPI    │  └─────────────┘
                         └──────┬───────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │ Random Forest ML │
                       │      Model       │
                       └────────┬─────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │ SHAP Explanation │
                       └──────────────────┘


medisense/
│
├── medinsense-ai/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── Assistant.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── HealthAI.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Hospitals.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Reports.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── ai-service/
│   ├── models/
│   │   └── diabetes_model.joblib
│   ├── main.py
│   ├── requirements.txt
│   └── ...
│
└── README.md
