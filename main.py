from fastapi import Query
from typing import List
from app import app
from deck import Deck

def ready_for_api(content: str) -> bool:
    for char in content:
        if char is None or not char.isalpha() or char == '':
            return False
    return True

@app.post("/login/")
def login(username: str, password: str):
    pass
      
@app.get("/cards/") 
def get_cards(source_language: str, target_language: str, source_word: List[str] = Query(None)):
    for word in source_word:
        if ready_for_api(word):
            print(word)
            return Deck(source_word, source_language, target_language)
    return "No words provided"

