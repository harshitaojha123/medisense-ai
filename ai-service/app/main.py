from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI

from app.schemas import DiabetesPredictionRequest
from app.explainability import explain_diabetes_prediction


BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = (
    BASE_DIR
    / "models"
    / "diabetes_model.joblib"
)


app = FastAPI(
    title="MediSense AI Service",
    description="AI and ML service for MediSense",
    version="1.0.0",
)


# Load trained model once when the API starts
model = joblib.load(MODEL_PATH)


FEATURE_ORDER = [
    "HighBP",
    "HighChol",
    "CholCheck",
    "BMI",
    "Smoker",
    "Stroke",
    "HeartDiseaseorAttack",
    "PhysActivity",
    "Fruits",
    "Veggies",
    "HvyAlcoholConsump",
    "AnyHealthcare",
    "NoDocbcCost",
    "GenHlth",
    "MentHlth",
    "PhysHlth",
    "DiffWalk",
    "Sex",
    "Age",
    "Education",
    "Income",
]


@app.get("/")
def root():
    return {
        "success": True,
        "message": "MediSense AI Service is running",
    }


@app.get("/health")
def health():
    return {
        "success": True,
        "service": "MediSense AI",
        "status": "healthy",
        "diabetes_model_loaded": True,
    }


@app.post("/predict/diabetes")
def predict_diabetes(
    data: DiabetesPredictionRequest
):

    input_data = data.model_dump()

    # Force the exact feature order used during training
    features = [
        input_data[feature]
        for feature in FEATURE_ORDER
    ]

    dataframe = pd.DataFrame(
        [features],
        columns=FEATURE_ORDER
    )

    # Generate probability
    probability = model.predict_proba(
        dataframe
    )[0][1]

    probability_percent = round(
        probability * 100,
        2
    )

    # Prototype risk bands
    if probability < 0.30:
        risk_band = "low"
    elif probability < 0.60:
        risk_band = "moderate"
    else:
        risk_band = "higher"

    # Generate explanation
    explanations = explain_diabetes_prediction(
        model,
        dataframe,
       
    )

    return {
        "success": True,

        "model": "diabetes_random_forest",

        "prediction": {
            "risk_probability": probability_percent,
            "risk_band": risk_band,
        },

        "explainability": {
            "top_factors": explanations,
            "note": (
                "These factors represent model feature "
                "importance patterns and should not be "
                "interpreted as causal effects."
            ),
        },

        "interpretation": (
            "This is an ML-based diabetes risk screening "
            "signal from the supplied features. It is not "
            "a medical diagnosis."
        ),
    }