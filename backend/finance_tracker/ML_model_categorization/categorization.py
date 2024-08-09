import os
import pandas as pd
import joblib
from .rule_based import rule_based_categorization

lookup_table_path = './finance_tracker/ML_model_categorization/data/lookup_table.csv'

# Function to create a lookup table or load it if it already exists
def initialize_lookup_table():
    if not os.path.exists(lookup_table_path):
        os.makedirs(os.path.dirname(lookup_table_path), exist_ok=True)
        # Create an empty lookup table or load from a default source if needed
        lookup_table = pd.DataFrame(columns=['description', 'category', 'subCategory'])
        lookup_table.to_csv(lookup_table_path, index=False)
    else:
        lookup_table = pd.read_csv(lookup_table_path)

    return lookup_table

lookup_table = initialize_lookup_table()
# Make lookup table a dictionary for faster lookup
lookup_dict = {row['description']: (row['category'], row['subCategory']) for _, row in lookup_table.iterrows()}

def update_lookup_table(description, category, subCategory):
    global lookup_table, lookup_dict

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
    
    model_path = './finance_tracker/ML_model_categorization/transaction_categorizer.joblib'
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"ML model not found at path: {model_path}")

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

    # Check if the transaction is in lookup table
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