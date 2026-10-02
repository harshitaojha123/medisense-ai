import pandas as pd

from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    precision_score,
    recall_score,
    f1_score,
)


DATA_PATH = Path(
    "data/diabetes_binary_health_indicators_BRFSS2015.csv"
)


def main():

    # -----------------------------------------
    # 1. Load data
    # -----------------------------------------

    df = pd.read_csv(DATA_PATH)

    X = df.drop(
        columns=["Diabetes_binary"]
    )

    y = df["Diabetes_binary"].astype(int)

    # -----------------------------------------
    # 2. Split data
    # -----------------------------------------

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )

    # -----------------------------------------
    # 3. Train Random Forest
    # -----------------------------------------

    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=12,
        min_samples_leaf=5,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )

    print("\nTraining Random Forest...")

    model.fit(
        X_train,
        y_train
    )

    print("Training complete.")

    # -----------------------------------------
    # 4. Get probabilities
    # -----------------------------------------

    probabilities = model.predict_proba(
        X_test
    )[:, 1]

    # -----------------------------------------
    # 5. Test thresholds
    # -----------------------------------------

    thresholds = [
        0.30,
        0.35,
        0.40,
        0.45,
        0.50,
        0.55,
        0.60,
        0.65,
        0.70,
    ]

    print("\n========================================")
    print("Threshold Analysis")
    print("========================================")

    print(
        f"{'Threshold':<12}"
        f"{'Precision':<12}"
        f"{'Recall':<12}"
        f"{'F1':<12}"
    )

    print("-" * 48)

    for threshold in thresholds:

        predictions = (
            probabilities >= threshold
        ).astype(int)

        precision = precision_score(
            y_test,
            predictions,
            zero_division=0
        )

        recall = recall_score(
            y_test,
            predictions,
            zero_division=0
        )

        f1 = f1_score(
            y_test,
            predictions,
            zero_division=0
        )

        print(
            f"{threshold:<12.2f}"
            f"{precision:<12.4f}"
            f"{recall:<12.4f}"
            f"{f1:<12.4f}"
        )


if __name__ == "__main__":
    main()