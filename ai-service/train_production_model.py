import pandas as pd
import joblib

from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier


DATA_PATH = Path(
    "data/diabetes_binary_health_indicators_BRFSS2015.csv"
)

MODEL_PATH = Path(
    "models/diabetes_model.joblib"
)


def main():

    print("\nLoading dataset...")

    df = pd.read_csv(DATA_PATH)

    X = df.drop(
        columns=["Diabetes_binary"]
    )

    y = df["Diabetes_binary"].astype(int)

    print(f"Rows: {len(df)}")
    print(f"Features: {X.shape[1]}")

    # Keep the same split used during evaluation.
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )

    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=12,
        min_samples_leaf=5,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )

    print("\nTraining final Random Forest...")

    model.fit(
        X_train,
        y_train
    )

    print("Training complete.")

    MODEL_PATH.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    joblib.dump(
        model,
        MODEL_PATH
    )

    print(
        f"\nModel saved to: {MODEL_PATH}"
    )

    print("\nFeature order used by model:")

    for index, feature in enumerate(X.columns):
        print(
            f"{index + 1:2}. {feature}"
        )


if __name__ == "__main__":
    main()