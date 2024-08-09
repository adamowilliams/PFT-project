import pandas as pd
from .main import process_transactions

def import_transactions(file_path):
    if file_path.name.endswith('.xlsx'):
        transactions_data = pd.read_excel(file_path, engine='openpyxl')
    elif file_path.name.endswith('.csv'):
        transactions_data = pd.read_csv(file_path)
    else:
        raise ValueError('Unsupported file type')

    if transactions_data.empty:
        raise ValueError('The provided file is empty or has an unsupported format.')

    # Check for 'Saldo' or handle the new format without 'Saldo'
    if 'Saldo' in transactions_data.values:
        # Find the row index where "Saldo" is located
        saldo_row_index = transactions_data[transactions_data.eq('Saldo').any(axis=1)].index.min()
    
        # Skip all rows above and including the "Saldo" row
        if pd.notna(saldo_row_index):
            transactions_data = transactions_data.iloc[saldo_row_index + 1:]

        transactions_data.columns = ['created_at_dup', 'created_at', 'description', 'amount', 'saldo']
        transactions_data = transactions_data.drop(['created_at_dup', 'saldo'], axis=1)

    else:

        # Find the row index where "Saldo" is located
        belopp_row_index = transactions_data[transactions_data.eq('Belopp').any(axis=1)].index.min()
    
        # Skip all rows above and including the "Saldo" row
        if pd.notna(belopp_row_index):
            transactions_data = transactions_data.iloc[belopp_row_index + 1:]

        # Adjust to handle the new file format without 'Saldo'
        transactions_data.columns = ["created_at_dup", "created_at", "description", "amount"]
        transactions_data = transactions_data.drop(['created_at_dup'], axis=1)

     # Convert the 'amount' column to numeric, coercing errors to NaN
    transactions_data['amount'] = pd.to_numeric(transactions_data['amount'], errors='coerce')

    # Add columns 'category' and 'subCategory'
    transactions_data['category'] = 'Other'
    transactions_data['subCategory'] = 'Other'

    if 'transaction_type' not in transactions_data.columns:
        transactions_data.insert(0, 'transaction_type', transactions_data['amount'].apply(lambda x: 'Expense' if x < 0 else 'Income'))

    # Default date for the rows that don't have a date
    transactions_data['created_at'] = transactions_data['created_at'].fillna('1970-01-01')

    # Convert 'created_at' to date format
    transactions_data['created_at'] = pd.to_datetime(transactions_data['created_at']).dt.date

    transactions_list = transactions_data.to_dict(orient='records')

    # Process and save the transactions
    transactions_list = process_transactions(transactions_data)
    output_csv_path = './finance_tracker/ML_model_categorization/data/categorized_transactions.csv'
    transactions_list.to_csv(output_csv_path, index=False)

    transactions_list = transactions_list.to_dict(orient='records')
    return transactions_list


# Example usage for testing
if __name__ == "__main__":
    file_path = 'C:\\DATAVETENSKAP\\PFT-summer-project\\backend\\finance_tracker\\scripts\\Handelsbanken_Account_Transactions_2024-06-16.xlsx'
    transactions = import_transactions(file_path)
