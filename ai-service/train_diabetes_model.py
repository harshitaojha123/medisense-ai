import pandas as pd

from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score,
    confusion_matrix,
    classification_report,
)


DATA_PATH = Path(
    "data/diabetes_binary_health_indicators_BRFSS2015.csv"
)


def main():
    # -----------------------------------------
    # 1. Load dataset
    # -----------------------------------------

    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found: {DATA_PATH}"
        )

    df = pd.read_csv(DATA_PATH)

    print("\nDataset loaded")
    print(f"Rows: {df.shape[0]}")
    print(f"Columns: {df.shape[1]}")

    # -----------------------------------------
    # 2. Separate features and target
    # -----------------------------------------

    X = df.drop(
        columns=["Diabetes_binary"]
    )

    y = df["Diabetes_binary"].astype(int)

    print("\nFeature count:", X.shape[1])

    # -----------------------------------------
    # 3. Train/test split
    # -----------------------------------------

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )

    print("\nTrain samples:", len(X_train))
    print("Test samples:", len(X_test))

    print("\nTraining class distribution:")
    print(y_train.value_counts())

    print("\nTesting class distribution:")
    print(y_test.value_counts())

    # -----------------------------------------
    # 4. Build model pipeline
    # -----------------------------------------

    model = Pipeline(
        steps=[
            (
                "scaler",
                StandardScaler()
            ),
            (
                "classifier",
                LogisticRegression(
                    max_iter=1000,
                    class_weight="balanced",
                    random_state=42,
                ),
            ),
        ]
    )

    # -----------------------------------------
    # 5. Train
    # -----------------------------------------

    print("\nTraining model...")

    model.fit(
        X_train,
        y_train
    )

    print("Training complete.")

    # -----------------------------------------
    # 6. Predictions
    # -----------------------------------------

    y_pred = model.predict(X_test)

    y_probability = model.predict_proba(
        X_test
    )[:, 1]

    # -----------------------------------------
    # 7. Evaluation
    # -----------------------------------------

    accuracy = accuracy_score(
        y_test,
        y_pred
    )

    precision = precision_score(
        y_test,
        y_pred,
        zero_division=0
    )

    recall = recall_score(
        y_test,
        y_pred,
        zero_division=0
    )

    f1 = f1_score(
        y_test,
        y_pred,
        zero_division=0
    )

    roc_auc = roc_auc_score(
        y_test,
        y_probability
    )

    pr_auc = average_precision_score(
        y_test,
        y_probability
    )

    matrix = confusion_matrix(
        y_test,
        y_pred
    )

    # -----------------------------------------
    # 8. Print results
    # -----------------------------------------

    print("\n========================================")
    print("MediSense Diabetes Model Results")
    print("========================================")

    print(
        f"\nAccuracy : {accuracy:.4f}"
    )

    print(
        f"Precision: {precision:.4f}"
    )

    print(
        f"Recall   : {recall:.4f}"
    )

    print(
        f"F1 Score : {f1:.4f}"
    )

    print(
        f"ROC-AUC  : {roc_auc:.4f}"
    )

    print(
        f"PR-AUC   : {pr_auc:.4f}"
    )

    print("\nConfusion Matrix:")

    print(matrix)

    print("\nClassification Report:")

    print(
        classification_report(
            y_test,
            y_pred,
            zero_division=0
        )
    )


if __name__ == "__main__":
    main()