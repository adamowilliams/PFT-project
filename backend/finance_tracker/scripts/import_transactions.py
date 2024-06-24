import pandas as pd

def import_transactions(file_path):
    if file_path.name.endswith('.xlsx'):
        transactions_data = pd.read_excel(file_path, engine='openpyxl')
    elif file_path.name.endswith('.csv'):
        transactions_data = pd.read_csv(file_path)
    else:
        raise ValueError('Unsupported file type')
    
# Find the row index where "saldo" is located
    saldo_row_index = transactions_data[transactions_data.eq('Saldo').any(axis=1)].index.min()
    
    # Skip all rows above and including the "saldo" row
    if pd.notna(saldo_row_index):
        transactions_data = transactions_data.iloc[saldo_row_index + 1:]

    # Rename the columns
    transactions_data.columns = ['created_at_dup', 'created_at', 'description', 'amount', 'saldo']
  
    # Drop the duplicate 'created_at' column and 'saldo' column
    transactions_data = transactions_data.drop(['created_at_dup', 'saldo'], axis=1)
    
    # Add a default date for the rows that don't have a date
    transactions_data['created_at'] = transactions_data['created_at'].fillna('1337-69-69')

    # Check if 'category' column exists, if not, create and fill it with 'Other'
    if 'category' not in transactions_data.columns:
        transactions_data['category'] = 'Other'
    else:
        transactions_data['category'] = transactions_data['category'].fillna('Other')
    
    # Add the 'transaction_type' column based on the 'amount' column
    transactions_data['transaction_type'] = transactions_data['amount'].apply(lambda x: 'Expense' if x < 0 else 'Income')

    # Convert the dataframe to a list of dictionaries
    transactions_list = transactions_data.to_dict(orient='records')

    return transactions_list
