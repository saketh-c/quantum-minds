import pandas as pd
import numpy as np
import os

# Ensure output directory exists
os.makedirs('backend', exist_ok=True)

def load_and_process_student_data(filepath):
    print("Loading Student Depression Dataset...")
    try:
        df = pd.read_csv(filepath)
    except Exception as e:
        print(f"Could not load file: {e}")
        return

    print(f"Total rows: {len(df)}")
    
    # Filter only Students (though dataset seems to be all students? 'Profession' col)
    # The head showed 'Profession' column.
    if 'Profession' in df.columns:
        df = df[df['Profession'] == 'Student']
    
    print(f"Student rows: {len(df)}")
    
    generated_data = pd.DataFrame()

    # --- 14 VARIABLE HILBERT SPACE MAPPING ---

    # 2. Sleep Quality
    # 'Sleep Duration': "5-6 hours", "Less than 5 hours", "7-8 hours", "More than 8 hours"
    def map_sleep(val):
        if "Less" in str(val): return 0.2
        if "5-6" in str(val): return 0.5
        if "7-8" in str(val): return 0.9
        if "More" in str(val): return 0.8
        return 0.5
    generated_data['2_Sleep'] = df['Sleep Duration'].apply(map_sleep)

    # 3. Pubertal Stage (Age)
    # Age column
    generated_data['3_Pubertal'] = df['Age'].apply(lambda x: (x - 12) / (30 - 12)) # Normalize roughly
    generated_data['3_Pubertal'] = generated_data['3_Pubertal'].clip(0, 1)

    # 7. Diet Quality
    # 'Dietary Habits': "Healthy", "Moderate", "Unhealthy"
    diet_map = {"Healthy": 0.9, "Moderate": 0.5, "Unhealthy": 0.2}
    generated_data['7_Diet'] = df['Dietary Habits'].map(diet_map).fillna(0.5)

    # 8. Academic Pressure (Direct)
    # 0-5 scale in head? Or 0-10? Head showed 5.0. Let's normalize assuming max 5.
    generated_data['8_Academic'] = df['Academic Pressure'] / 5.0
    generated_data['8_Academic'] = generated_data['8_Academic'].clip(0, 1)

    # 9. Family Conflict (Proxy: Family History)
    # 'Family History of Mental Illness': Yes/No. 
    # Not exact, but 'Yes' implies genetic risk/potential stress.
    generated_data['9_Family'] = df['Family History of Mental Illness'].map({'Yes': 0.8, 'No': 0.2}).fillna(0.2)
    # Add noise
    generated_data['9_Family'] += np.random.normal(0, 0.1, len(df))
    generated_data['9_Family'] = generated_data['9_Family'].clip(0, 1)

    # 6. Substance Risk (Proxy: Financial Stress? Or Random)
    # 'Financial Stress' -> Stress could lead to substance? Let's use it as a proxy for "Risk Factors"
    generated_data['6_Substance'] = df['Financial Stress'] / 5.0 # Assuming similar scale
    generated_data['6_Substance'] = generated_data['6_Substance'].fillna(0.2).clip(0, 1)

    # 4. Anxiety (Hume Proxy)
    # Use 'Depression' label as a strong correlate, plus 'Have you ever had suicidal thoughts ?'
    # 'Depression': 0 or 1.
    # 'Suicidal': Yes/No.
    base_anxiety = df['Depression'] * 0.6
    suicidal_add = df['Have you ever had suicidal thoughts ?'].map({'Yes': 0.3, 'No': 0}).fillna(0)
    generated_data['4_Anxiety'] = base_anxiety + suicidal_add + np.random.uniform(0, 0.2, len(df))
    generated_data['4_Anxiety'] = generated_data['4_Anxiety'].clip(0, 1)

    # 5. Isolation (Hume Proxy)
    # Correlated with Study Satisfaction (Low sat -> High Iso) -> Inverse
    # 'Study Satisfaction'
    generated_data['5_Isolation'] = 1.0 - (df['Study Satisfaction'] / 5.0)
    generated_data['5_Isolation'] = generated_data['5_Isolation'].clip(0, 1)

    # --- SIMULATED GAMES (ENTANGLEMENT) ---
    
    # 0. Connectivity (Focus)
    # Low Sleep + High Academic Pressure + High Anxiety = Low Connectivity
    generated_data['0_Connectivity'] = 0.9 - (generated_data['8_Academic'] * 0.3) - (generated_data['4_Anxiety'] * 0.4) - ((1-generated_data['2_Sleep']) * 0.2)
    generated_data['0_Connectivity'] += np.random.normal(0, 0.05, len(df))
    generated_data['0_Connectivity'] = generated_data['0_Connectivity'].clip(0, 1)

    # 1. Hippocampal (Memory)
    # Low Diet + High Depression = Low Memory
    generated_data['1_Hippocampal'] = 0.8 - (generated_data['7_Diet'] * 0.2) - (df['Depression'] * 0.4)
    generated_data['1_Hippocampal'] += np.random.normal(0, 0.05, len(df))
    generated_data['1_Hippocampal'] = generated_data['1_Hippocampal'].clip(0, 1)

    # FILL REST
    for col in ['10_Bullying', '11_Safety', '12_Monitoring', '13_Exercise']:
        generated_data[col] = np.random.uniform(0.2, 0.8, len(df))

    # ORDER
    col_order = ['0_Connectivity', '1_Hippocampal', '2_Sleep', '3_Pubertal', 
                 '4_Anxiety', '5_Isolation', '6_Substance', '7_Diet', 
                 '8_Academic', '9_Family', '10_Bullying', '11_Safety', 
                 '12_Monitoring', '13_Exercise']
    
    final_df = generated_data[col_order].copy()
    
    # FORCE ENTANGLED DISTRESS LABEL
    # Logic: Risk = 1 if (Anxiety > 0.6 AND Connectivity < 0.5) OR (Depression in source == 1)
    
    # We want to capture implicit risk too.
    final_df['Risk_Label'] = df['Depression'] | ((final_df['4_Anxiety'] > 0.7) & (final_df['0_Connectivity'] < 0.5))
    final_df['Risk_Label'] = final_df['Risk_Label'].astype(int)

    output_path = 'backend/synthetic_clinical_data.csv'
    final_df.to_csv(output_path, index=False)
    print(f"Generated {len(final_df)} profiles from Student Depression Dataset.")

if __name__ == "__main__":
    path = "Student Depression Dataset.csv"
    if os.path.exists(path):
        load_and_process_student_data(path)
    else:
        print(f"{path} not found.")
