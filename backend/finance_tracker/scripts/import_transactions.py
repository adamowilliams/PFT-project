import pandas as pd
from .main import process_transactions

def import_transactions(file_path):
    if file_path.name.endswith('.xlsx'):
        transactions_data = pd.read_excel(file_path, engine='openpyxl')
    elif file_path.name.endswith('.csv'):
        transactions_data = pd.read_csv(file_path)
    else:
        raise ValueError('Unsupported file type')
    

    # If the DataFrame is empty, raise an error
    if transactions_data.empty:
        raise ValueError('The provided file is empty or has an unsupported format.')


    if 'Saldo' in transactions_data.values:
    
        # Find the row index where "saldo" is located
        saldo_row_index = transactions_data[transactions_data.eq('Saldo').any(axis=1)].index.min()
    
        # Skip all rows above and including the "saldo" row
        if pd.notna(saldo_row_index):
            transactions_data = transactions_data.iloc[saldo_row_index + 1:]

        # Rename the columns
        transactions_data.columns = ['created_at_dup', 'created_at', 'description', 'amount', 'saldo']
  
        # Drop the duplicate 'created_at' column and 'saldo' column
        transactions_data = transactions_data.drop(['created_at_dup', 'saldo'], axis=1)

        # Add missing columns 'category' and 'subCategory'
        transactions_data['category'] = 'Other'
        transactions_data['subCategory'] = 'Other'
    

    else:
        
        transactions_data.columns = ["transaction_type", "created_at","description","amount","category","subCategory"]
        
        # Check if 'category' column exists, if not, create and fill it with 'Other'
        if 'category' not in transactions_data.columns:
            transactions_data['category'] = 'Other'
        else:
            transactions_data['category'] = transactions_data['category'].fillna('Other')

        if 'subCategory' not in transactions_data.columns:
            transactions_data['subCategory'] = 'Other'
        else:
            transactions_data['subCategory'] = transactions_data['subCategory'].fillna('Other')

    if 'transaction_type' not in transactions_data.columns:
        transactions_data.insert(0, 'transaction_type', transactions_data['amount'].apply(lambda x: 'Expense' if x < 0 else 'Income'))
    
    # Add a default date for the rows that don't have a date
    transactions_data['created_at'] = transactions_data['created_at'].fillna('1337-01-01')

    # Convert 'created_at' to date format
    transactions_data['created_at'] = pd.to_datetime(transactions_data['created_at']).dt.date

    # Convert the dataframe to a list of dictionaries
    transactions_list = transactions_data.to_dict(orient='records')

    #transactions_df = pd.DataFrame(transactions_list)
    #csv_file_path = 'C:\\DATAVETENSKAP\\PFT-summer-project\\backend\\finance_tracker\\scripts\\transactions.csv'
    #transactions_df.to_csv(csv_file_path, index=False)

    # Process the transactions
    transactions_list = process_transactions(transactions_data)
    transactions_list.to_csv('categorized_transactions.csv', index=False)

    transactions_list = transactions_list.to_dict(orient='records')
    return transactions_list


# Example usage
if __name__ == "__main__":
    file_path = 'C:\\DATAVETENSKAP\\PFT-summer-project\\backend\\finance_tracker\\scripts\\Handelsbanken_Account_Transactions_2024-06-16.xlsx'
    transactions = import_transactions(file_path)