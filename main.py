from fastapi import Query
from typing import List
from app import app
from deck import Deck
from database import Database
import logging

db = Database()

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
def get_cards(count: str, source_language: str, target_language: str):
    logging.info(f"get_cards called to get {count} in total")
    deck = Deck(source_language, target_language)
    deck.build_deck_from_db(count)
    return deck.deck

#change to post
@app.post("/refresh/") 
def update_db(source_language: str, target_language: str):
    logging.info(f"update_db has been called for sl {source_language} and tl {target_language}")
    deck = Deck(source_language, target_language)
    deck.build_deck_from_duo()
    deck.upload_deck()


    
    
