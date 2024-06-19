import pandas as pd

def import_transactions(file_path):
    if file_path.name.endswith('.xlsx'):
        transactions_data = pd.read_excel(file_path, engine='openpyxl')
    elif file_path.name.endswith('.csv'):
        transactions_data = pd.read_csv(file_path)
    else:
        raise ValueError('Unsupported file type')


    transactions_data.columns = ['created_at', 'description', 'amount']

    #add a default date for the rows that don't have a date
    transactions_data['created_at'] = transactions_data['created_at'].fillna('1337-69-69')

    transactions_list = transactions_data.to_dict(orient='records')
    

    return transactions_list
