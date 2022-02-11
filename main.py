from fastapi import Query
from typing import List
from app import app
from deck import Deck
from database import Database

def validate(content: str) -> bool:
    for char in content:
        if char is None or not char.isalpha() or char == '':
            return False
    return True

@app.post("/login/")
def login(username: str, password: str):
    pass
      
@app.get("/cards/") 
def create_cards(source_language: str, target_language: str, source_word: List[str] = Query(None)):
    #db_helper.add_word("fart", "spanish", ["poo", "poop"], "Mattish")
    for word in source_word:
        if validate(word):
            print(word)
            deck = Deck(source_word, source_language, target_language)
            
            for card in deck.cards:
                translations = deck.get_all_translations(card.source_word)
                # need to get all translations at once then add them
                db = Database()
                db.add_word(card.source_word, deck.source_language, translations, deck.target_language)
                # db_helper.add_word(card.source_word, deck.source_language, translations, deck.target_language)
                
            
            #return Deck(source_word, source_language, target_language)
    return "No words provided"

@app.get("/") 
def get_cards():
    print("starting")
    ##db_helper.create_tables()
    ##source_words = db_helper.get_words(count, source_language)
    deck = Deck("fi", "es")
    deck.build_deck_from_duo()
    
    db = Database()
    db.connect()
    db.create_tables()
    db.upload_deck(deck)
    db.close()
    query = db.get_words(2, "fi")
    print(f"query: {query}")
    
    print(deck)
    return deck

def update_db():
    db = Database()
    deck = Deck("fi", "es")
    deck.build_deck_from_duo()
    db.connect()
    db.upload_deck(deck)
    
