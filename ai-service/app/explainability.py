import pandas as pd
import shap


def explain_diabetes_prediction(
    model,
    dataframe: pd.DataFrame,
):
    """
    Generate a local SHAP explanation for
    an individual diabetes prediction.

    SHAP values describe how each feature
    contributed to the model output.

    They do not establish medical causation.
    """

    explainer = shap.TreeExplainer(model)

    shap_values = explainer.shap_values(
        dataframe
    )

    # Handle SHAP output for binary classification
    if isinstance(shap_values, list):
        values = shap_values[1][0]

    elif len(shap_values.shape) == 3:
        values = shap_values[0, :, 1]

    else:
        values = shap_values[0]

    explanations = []

    for index, feature in enumerate(
        dataframe.columns
    ):

        shap_value = float(
            values[index]
        )

        feature_value = int(
            dataframe.iloc[0][feature]
        )

        if abs(shap_value) < 0.0001:
            continue

        if shap_value > 0:
            direction = "increased"
        else:
            direction = "decreased"

        explanations.append(
            {
                "feature": feature,
                "value": feature_value,
                "shap_value": round(
                    shap_value,
                    6
                ),
                "direction": direction,
            }
        )

    explanations.sort(
        key=lambda item: abs(
            item["shap_value"]
        ),
        reverse=True,
    )

    return explanations[:5]