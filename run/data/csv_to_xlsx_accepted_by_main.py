import pandas as pd
import numpy as np
import glob

# Find all CSV files that start with 'accepted_by_main'
csv_files = glob.glob('accepted_by_main*.csv')

for csv_file in csv_files:
    df = pd.read_csv(csv_file, dtype=str)
    df = df.dropna(how="all")
    df = df.replace({np.nan: None, np.inf: None, -np.inf: None})
    df = df.loc[:, ~df.columns.str.contains('^Unnamed')]
    xlsx_file = csv_file.replace('.csv', '.xlsx')
    df.to_excel(xlsx_file, index=False)
    print(f"Converted {csv_file} to {xlsx_file} (compatible with FastAPI main.py)")
