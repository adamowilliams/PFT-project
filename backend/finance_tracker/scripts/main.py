import pandas as pd
from .categorization import categorize_transaction


def process_transactions(transactions_data):
    categorized_data = []
    for index, row in transactions_data.iterrows():
        description = row['description']
        category, subcategory = categorize_transaction(description)
        row['category'] = category
        row['subCategory'] = subcategory
        categorized_data.append(row)

    return pd.DataFrame(categorized_data)

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
        #import_transactions(file_path)
    else:
        print('Please provide the path to the transactions file as an argument.')

'''
# Load new transactions for categorization and import the rule-based categorization function
new_transactions = pd.read_csv('./data/new_transactions.csv')
new_transactions[['Predicted_Kategori', 'Predicted_Subkategori']] = new_transactions['description'].apply(lambda x: pd.Series(categorize_and_predict(x)))

# Save the transactions
new_transactions.to_csv('./data/categorized_transactions.csv', index=False)

print(new_transactions[['description', 'Predicted_Kategori', 'Predicted_Subkategori']])
'''


'''
def categorize_transactions(input_csv):
    # Load new transactions for categorization
    new_transactions = pd.read_csv(input_csv)
    new_transactions[['Predicted_Kategori', 'Predicted_Subkategori']] = new_transactions['description'].apply(lambda x: pd.Series(categorize_and_predict(x)))

    # Convert the DataFrame to CSV format without saving to disk
    output_csv = StringIO()
    new_transactions.to_csv(output_csv, index=False)
    output_csv.seek(0)  # Move to the start of the StringIO object

    # Return the CSV content as a string
    return output_csv
'''