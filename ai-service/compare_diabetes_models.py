import pandas as pd

from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score,
)


DATA_PATH = Path(
    "data/diabetes_binary_health_indicators_BRFSS2015.csv"
)


def evaluate_model(name, model, X_train, X_test, y_train, y_test):
    print(f"\nTraining {name}...")

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    probabilities = model.predict_proba(X_test)[:, 1]

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

    roc_auc = roc_auc_score(
        y_test,
        probabilities
    )

    pr_auc = average_precision_score(
        y_test,
        probabilities
    )

    print(f"{name} complete.")

    return {
        "Model": name,
        "Precision": precision,
        "Recall": recall,
        "F1": f1,
        "ROC-AUC": roc_auc,
        "PR-AUC": pr_auc,
    }


def main():

    # -----------------------------------------
    # 1. Load dataset
    # -----------------------------------------

    df = pd.read_csv(DATA_PATH)

    X = df.drop(
        columns=["Diabetes_binary"]
    )

    y = df["Diabetes_binary"].astype(int)

    # -----------------------------------------
    # 2. Train/test split
    # -----------------------------------------

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )

    # -----------------------------------------
    # 3. Logistic Regression
    # -----------------------------------------

    logistic_model = Pipeline(
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
    # 4. Random Forest
    # -----------------------------------------

    random_forest_model = RandomForestClassifier(
        n_estimators=300,
        max_depth=12,
        min_samples_leaf=5,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )

    # -----------------------------------------
    # 5. Evaluate both
    # -----------------------------------------

    results = []

    results.append(
        evaluate_model(
            "Logistic Regression",
            logistic_model,
            X_train,
            X_test,
            y_train,
            y_test,
        )
    )

    results.append(
        evaluate_model(
            "Random Forest",
            random_forest_model,
            X_train,
            X_test,
            y_train,
            y_test,
        )
    )

    # -----------------------------------------
    # 6. Comparison
    # -----------------------------------------

    results_df = pd.DataFrame(results)

    print("\n========================================")
    print("MediSense Model Comparison")
    print("========================================")

    print(
        results_df.to_string(
            index=False,
            float_format=lambda x: f"{x:.4f}"
        )
    )


if __name__ == "__main__":
    main()