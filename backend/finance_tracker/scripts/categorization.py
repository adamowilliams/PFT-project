import os
import pandas as pd
import joblib
from .rule_based import rule_based_categorization

    # Function to create a lookup table or load it if it already exists
def initialize_lookup_table():
    lookup_table_path = './lookup_table.csv'
    if not os.path.exists(lookup_table_path):
        os.makedirs(os.path.dirname(lookup_table_path), exist_ok=True)
        # Create an empty lookup table or load from a default source if needed
        lookup_table = pd.DataFrame(columns=['description', 'category', 'subCategory'])
        lookup_table.to_csv(lookup_table_path, index=False)
    else:
        lookup_table = pd.read_csv(lookup_table_path)

    return lookup_table

# Call the function for the lookup table
lookup_table = initialize_lookup_table()
# Make lookup table a dictionary for faster lookup
lookup_dict = {row['description']: (row['category'], row['subCategory']) for _, row in lookup_table.iterrows()}

# Function to update the lookup table
def update_lookup_table(description, category, subCategory):
    # Read the existing lookup table
    lookup_table_path = './lookup_table.csv'
    if os.path.exists(lookup_table_path):
        lookup_table = pd.read_csv(lookup_table_path)
    else:
        lookup_table = pd.DataFrame(columns=['description', 'category', 'subCategory'])

    # Remove entries with the same description
    lookup_table = lookup_table[lookup_table['description'] != description]

    # Add the updated entry
    new_entry = pd.DataFrame({'description': [description], 'category': [category], 'subCategory': [subCategory]})
    lookup_table = pd.concat([lookup_table, new_entry], ignore_index=True)

    # Save the updated lookup table
    lookup_table.to_csv(lookup_table_path, index=False)

    # Update the lookup_dict
    lookup_dict[description] = (category, subCategory)

def ml_categorization(description):
    
    model_path = 'C:\\DATAVETENSKAP\\PFT-summer-project\\backend\\finance_tracker\\scripts\\transaction_categorizer.joblib'  # Update this path if needed
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"ML model not found at path: {model_path}")
    # Load the model
    model = joblib.load(model_path)
    # Use ML model for prediction with confidence check
    probas = model.predict_proba(pd.DataFrame([description], columns=['description']))
    # Get probabilities and predictions for each target
    probas_category = probas[0][0]
    probas_subCategory = probas[1][0]
    
    max_prob_category = max(probas_category)
    max_prob_subCategory = max(probas_subCategory)
    
    predicted_category = model.classes_[0][probas_category.argmax()]
    predicted_subCategory = model.classes_[1][probas_subCategory.argmax()]
    
    if max_prob_category < 0.8 or max_prob_subCategory < 0.8:  # Confidence threshold
        chosen_category, chosen_subCategory = "", ""
    else:
        chosen_category, chosen_subCategory = predicted_category, predicted_subCategory
        return chosen_category, chosen_subCategory


def categorize_transaction(description):

    # Check if the transaction is in the lookup table
    if description in lookup_dict:
        return lookup_dict[description]
    
    # Fallback to rule-based categorization
    category, subCategory = rule_based_categorization(description)
    if category != 'Uncategorized':
        update_lookup_table(description, category, subCategory)
        return category, subCategory

    # Fallback to ML categorization
    category, subCategory = ml_categorization(description)
    update_lookup_table(description, category, subCategory)
    return category, subCategory

def get_user_input(description):
    print(f"Transaction: {description}")
    available_categories = {
        "Housing": ['Building & Garden', 'Rent & Fee'],
        "Food & Drink": ['Groceries', 'Cafe & Snacks', 'Restaurant & Bar', 'Alcohol & Tobacco'],
        "Household": ['Pets', 'Media, Mobile, and IT', 'Healthcare & Wellness'],
        'Transport': ['Vehicles & Fuel', 'Bus & Train'],
        "Entertainment & Shopping": ['Toys & Games', 'Culture & Entertainment', 'Beauty & Personal Care', 'Home Electronics', 'Clothes & Fashion', 'Vacation', 'Sports & Leisure'],
        "Miscellaneous": ['Support & Subsidies', 'Savings', 'Swish']
    }
    print("Please select a category for this transaction:")
    for i, category in enumerate(available_categories, 1):
        print(f"{i}. {category}")
    category_choice = int(input("Enter the number corresponding to the category: "))
    chosen_category = list(available_categories.keys())[category_choice - 1]
    
    print(f"Please select a subCategory for {chosen_category}:")
    for i, subCategory in enumerate(available_categories[chosen_category], 1):
        print(f"{i}. {subCategory}")
    subCategory_choice = int(input("Enter the number corresponding to the subCategory: "))
    chosen_subCategory = available_categories[chosen_category][subCategory_choice - 1]
    
    return chosen_category, chosen_subCategory
