"""
Preprocess the Kaggle Student Depression Dataset into the 14-feature format
expected by the VQC model. All features normalized to [0, 1].
"""
import pandas as pd
import numpy as np

INPUT_PATH = 'backend/Student Depression Dataset.csv'
OUTPUT_PATH = 'backend/kaggle_processed.csv'

SLEEP_MAP = {
    'Less than 5 hours': 0.2,
    '5-6 hours': 0.4,
    '7-8 hours': 0.7,
    'More than 8 hours': 0.9,
}

DIET_MAP = {
    'Unhealthy': 0.2,
    'Moderate': 0.5,
    'Healthy': 0.8,
}


def preprocess():
    df = pd.read_csv(INPUT_PATH)
    print(f"Loaded {len(df)} rows from {INPUT_PATH}")

    # Fill missing numeric values with median
    numeric_cols = ['Age', 'Academic Pressure', 'Work Pressure', 'CGPA',
                    'Study Satisfaction', 'Job Satisfaction', 'Work/Study Hours',
                    'Financial Stress']
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce')
        df[col] = df[col].fillna(df[col].median())

    out = pd.DataFrame()

    # Feature 0: Cognitive Connectivity — (CGPA/10 + StudySatisfaction/5) / 2
    out['Cognitive_Connectivity'] = ((df['CGPA'] / 10) + (df['Study Satisfaction'] / 5)) / 2

    # Feature 1: Memory Function — CGPA / 10
    out['Memory_Function'] = df['CGPA'] / 10

    # Feature 2: Sleep Quality — categorical map
    out['Sleep_Quality'] = df['Sleep Duration'].map(SLEEP_MAP).fillna(0.5)

    # Feature 3: Developmental Stage — (Age - 18) / (35 - 18)
    out['Developmental_Stage'] = ((df['Age'] - 18) / (35 - 18)).clip(0, 1)

    # Feature 4: Anxiety Level — (Academic + Work + Financial) / 15
    out['Anxiety_Level'] = (df['Academic Pressure'] + df['Work Pressure'] + df['Financial Stress']) / 15

    # Feature 5: Social Isolation — 1 - (StudySat + JobSat) / 10
    out['Social_Isolation'] = 1 - (df['Study Satisfaction'] + df['Job Satisfaction']) / 10

    # Feature 6: Substance Risk — Financial Stress / 5
    out['Substance_Risk'] = df['Financial Stress'] / 5

    # Feature 7: Diet Quality — categorical map
    out['Diet_Quality'] = df['Dietary Habits'].map(DIET_MAP).fillna(0.5)

    # Feature 8: Academic Pressure — scale / 5
    out['Academic_Pressure'] = df['Academic Pressure'] / 5

    # Feature 9: Family History — binary
    out['Family_History'] = (df['Family History of Mental Illness'] == 'Yes').astype(float)

    # Feature 10: Bullying Exposure — suicidal thoughts as distress proxy
    out['Bullying_Exposure'] = df['Have you ever had suicidal thoughts ?'].map({'No': 0.1, 'Yes': 0.9}).fillna(0.5)

    # Feature 11: Safety Perception — inverse of financial stress
    out['Safety_Perception'] = 1 - df['Financial Stress'] / 5

    # Feature 12: Social Monitoring — Job Satisfaction / 5
    out['Social_Monitoring'] = df['Job Satisfaction'] / 5

    # Feature 13: Physical Activity — inverse of work/study hours
    out['Physical_Activity'] = (1 - df['Work/Study Hours'] / 12).clip(0, 1)

    # Target
    out['Risk_Label'] = df['Depression'].astype(int)

    # Clip all features to [0, 1]
    feature_cols = [c for c in out.columns if c != 'Risk_Label']
    out[feature_cols] = out[feature_cols].clip(0, 1)

    # Drop any rows with NaN
    before = len(out)
    out = out.dropna().reset_index(drop=True)
    print(f"Dropped {before - len(out)} rows with NaN, {len(out)} remaining")

    # Stats
    print(f"\nFeature ranges:")
    for col in feature_cols:
        print(f"  {col}: [{out[col].min():.3f}, {out[col].max():.3f}] mean={out[col].mean():.3f}")
    print(f"\nTarget distribution:")
    print(f"  Depression=0: {(out['Risk_Label'] == 0).sum()} ({(out['Risk_Label'] == 0).mean():.1%})")
    print(f"  Depression=1: {(out['Risk_Label'] == 1).sum()} ({(out['Risk_Label'] == 1).mean():.1%})")

    out.to_csv(OUTPUT_PATH, index=False)
    print(f"\nSaved {len(out)} rows to {OUTPUT_PATH}")


if __name__ == '__main__':
    preprocess()
