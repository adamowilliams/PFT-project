import pandas as pd
import joblib
from rule_based import rule_based_categorization

# Load pre-trained model
model = joblib.load('transaction_categorizer.joblib')

# Function to initialize the lookup table with headers if it doesn't exist
def initialize_lookup_table():
    try:
        lookup_table = pd.read_csv('./data/lookup_table.csv')
        if lookup_table.empty:
            lookup_table = pd.DataFrame(columns=['Text', 'Kategori', 'Subkategori'])
            lookup_table.to_csv('./data/lookup_table.csv', index=False)
    except FileNotFoundError:
        lookup_table = pd.DataFrame(columns=['Text', 'Kategori', 'Subkategori'])
        lookup_table.to_csv('./data/lookup_table.csv', index=False)
    return lookup_table

# Load or initialize the lookup table
lookup_table = initialize_lookup_table()

# Convert lookup table to dictionary for fast lookup
lookup_dict = {row['Text']: (row['Kategori'], row['Subkategori']) for _, row in lookup_table.iterrows()}

def log_new_data(text, category, subcategory):
    new_entry = pd.DataFrame({'Text': [text], 'Kategori': [category], 'Subkategori': [subcategory]})
    new_entry.to_csv('./data/new_data_log.csv', mode='a', header=False, index=False)

def update_lookup_table(text, category, subcategory):
    lookup_dict[text] = (category, subcategory)
    new_entry = pd.DataFrame({'Text': [text], 'Kategori': [category], 'Subkategori': [subcategory]})
    new_entry.to_csv('./data/lookup_table.csv', mode='a', header=False, index=False)

def categorize_and_predict(text):
    # Check if the transaction is in the lookup table
    if text in lookup_dict:
        return lookup_dict[text]
    
    # Fallback to rule-based categorization
    category, subcategory = rule_based_categorization(text)
    if category != 'Uncategorized':
        update_lookup_table(text, category, subcategory)
        log_new_data(text, category, subcategory)
        return category, subcategory

    # Use ML model for prediction with confidence check
    probas = model.predict_proba(pd.DataFrame([text], columns=['Text']))
    
    # Get probabilities and predictions for each target
    probas_category = probas[0][0]
    probas_subcategory = probas[1][0]
    
    max_prob_category = max(probas_category)
    max_prob_subcategory = max(probas_subcategory)
    
    predicted_category = model.classes_[0][probas_category.argmax()]
    predicted_subcategory = model.classes_[1][probas_subcategory.argmax()]
    
    if max_prob_category < 0.8 or max_prob_subcategory < 0.8:  # Confidence threshold
        chosen_category, chosen_subcategory = get_user_input(text)
        update_lookup_table(text, chosen_category, chosen_subcategory)
        log_new_data(text, chosen_category, chosen_subcategory)
        return chosen_category, chosen_subcategory
    
    update_lookup_table(text, predicted_category, predicted_subcategory)
    log_new_data(text, predicted_category, predicted_subcategory)
    return predicted_category, predicted_subcategory

def get_user_input(text):
    print(f"Transaction: {text}")
    available_categories = {
        'Bostad': ['Bygg & trädgård', 'Hyra & avgift'],
        'Mat & dryck': ['Livsmedel', 'Café & snacks', 'Restaurang & bar', 'Alkohol & tobak'],
        'Hushåll': ['Husdjur', 'Media, mobil och IT', 'Sjukvård & hälsa'],
        'Transport': ['Fordon & drivmedel', 'Buss & tåg'],
        'Nöje & shopping': ['Leksaker & spel', 'Kultur & Nöjen', 'Skönhet & hälsa', 'Hemelektronik', 'Kläder & mode', 'Semester', 'Sport & fritid'],
        'Övrigt': ['Stöd & Bidrag', 'Sparande', 'Swish']
    }
    print("Please select a category for this transaction:")
    for i, category in enumerate(available_categories, 1):
        print(f"{i}. {category}")
    category_choice = int(input("Enter the number corresponding to the category: "))
    chosen_category = list(available_categories.keys())[category_choice - 1]
    
    print(f"Please select a subcategory for {chosen_category}:")
    for i, subcategory in enumerate(available_categories[chosen_category], 1):
        print(f"{i}. {subcategory}")
    subcategory_choice = int(input("Enter the number corresponding to the subcategory: "))
    chosen_subcategory = available_categories[chosen_category][subcategory_choice - 1]
    
    return chosen_category, chosen_subcategory
