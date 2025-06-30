from pymongo import MongoClient

def get_db():
    client = MongoClient('mongodb://localhost:27017/')  # Update with Atlas URI if needed
    db = client['learning_pathway']
    return db

def get_learners_collection():
    return get_db()['learners_data']

def get_parsed_learners_collection():
    return get_db()['parsed_learners']