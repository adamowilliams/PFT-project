import pandas as pd


def import_transactions(file_path):

    transactions_data = pd.read_excel(file_path, engine='openpyxl')


    transactions_data.columns = ['created_at', 'description', 'amount']

    #add a default date for the rows that don't have a date
    transactions_data['created_at'] = transactions_data['created_at'].fillna('1337-69-69')
    
    transactions_data.head()

    return transactions_data

if __name__ == "__main__":
    file_path = "Handelsbanken_Account_Transactions_2024-06-16.xlsx"
    transactions = import_transactions(file_path)
    print(transactions.head())