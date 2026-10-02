import pandas as pd

from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance


DATA_PATH = Path(
    "data/diabetes_binary_health_indicators_BRFSS2015.csv"
)


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
    # 4. Built-in feature importance
    # -----------------------------------------

    importance_df = pd.DataFrame({
        "feature": X.columns,
        "importance": model.feature_importances_,
    })

    importance_df = importance_df.sort_values(
        by="importance",
        ascending=False
    )

    print("\n========================================")
    print("Random Forest Feature Importance")
    print("========================================")

    print(
        importance_df.to_string(
            index=False,
            float_format=lambda x: f"{x:.6f}"
        )
    )

    # -----------------------------------------
    # 5. Permutation importance
    # -----------------------------------------

    print("\nCalculating permutation importance...")

    permutation = permutation_importance(
        model,
        X_test,
        y_test,
        n_repeats=5,
        random_state=42,
        scoring="roc_auc",
        n_jobs=-1,
    )

    permutation_df = pd.DataFrame({
        "feature": X.columns,
        "importance_mean":
            permutation.importances_mean,
        "importance_std":
            permutation.importances_std,
    })

    permutation_df = permutation_df.sort_values(
        by="importance_mean",
        ascending=False
    )

    print("\n========================================")
    print("Permutation Importance")
    print("========================================")

    print(
        permutation_df.to_string(
            index=False,
            float_format=lambda x: f"{x:.6f}"
        )
    )

    # -----------------------------------------
    # 6. Top 10 features
    # -----------------------------------------

    print("\n========================================")
    print("Top 10 Features")
    print("========================================")

    top_features = permutation_df.head(10)

    for index, row in top_features.iterrows():

        print(
            f"{row['feature']:<25}"
            f"{row['importance_mean']:.6f}"
        )


if __name__ == "__main__":
    main()