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