import os
import glob
import pandas as pd

# Directory containing the CSV files
csv_dir = os.path.join(os.path.dirname(__file__), 'data')

# Find all accepted_by_main*.csv files
csv_files = glob.glob(os.path.join(csv_dir, 'accepted_by_main*.csv'))

for csv_file in csv_files:
    df = pd.read_csv(csv_file)
    # Output Excel file with the same base name
    xlsx_file = csv_file.replace('.csv', '.xlsx')
    df.to_excel(xlsx_file, index=False)
    print(f"Converted {csv_file} to {xlsx_file}")
