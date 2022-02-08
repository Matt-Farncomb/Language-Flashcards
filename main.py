from fastapi import Query
from typing import List
from app import app
from deck import Deck
import db_helper

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
                db_helper.add_word(card.source_word, deck.source_language, translations, deck.target_language)
                
            
            #return Deck(source_word, source_language, target_language)
    return "No words provided"

def get_cards(source_language, count):
    source_words = db_helper.get_words(count, source_language)
    # [x for x in fruits if "a" in x]
    # Deck should maybe retrive all data from database.
    # So when creating the deck it rebuilds from the db
    # if no such entry exists in the db, then it rerives it from the API
    translations = [ trans.translations for trans in source_words]
    
