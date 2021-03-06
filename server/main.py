from fastapi import Query, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os
from typing import List
from app import app
from deck import Deck, languages, new_languages
from database import Database
from schemas import Result, Refresh, UploadedDeck
from fastapi.middleware.cors import CORSMiddleware
from base_logger import logging

logger = logging.getLogger(__name__)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/static/", StaticFiles(directory=f"..\client\static"), name="static")

templates = Jinja2Templates(directory=f"..\client\\templates")


@app.get("/", response_class=HTMLResponse)
def read_item(request: Request):  
    # js_files = [ f"js\{files}" for root, dirs, files in os.walk('..\client\static\js') for file in files ]
    js_files = []
    for path, dirs, fnames in os.walk("..\client\static\js"):
        for filename in [f for f in fnames if f.endswith(".js")]:
            newPath = path.split("static")[1]+"\\\\"
            js_files.append(f"{newPath}{filename}")
            
    lang = [ v["language"] for k, v in new_languages.items()  ]
    # js_files = [f"js\{entry.name}" for entry in os.scandir('..\client\static\js') if entry.is_file()]
    return templates.TemplateResponse("base.html", {"request": request, "lang": lang, "js_files": js_files})

def validate(content: str) -> bool:
    for char in content:
        if char is None or not char.isalpha() or char == '':
            return False
    return True

@app.post("/login/")
def login(username: str, password: str):
    pass
      
# @app.get("/cards/") 
# def create_cards(source_language: str, target_language: str, source_word: List[str] = Query(None)):
#     #db_helper.add_word("fart", "spanish", ["poo", "poop"], "Mattish")
#     for word in source_word:
#         if validate(word):
#             print(word)
#             deck = Deck(source_word, source_language, target_language)
            
#             for card in deck.cards:
#                 translations = deck.get_all_translations(card.source_word)
#                 # need to get all translations at once then add them
#                 db = Database()
#                 db.add_word(card.source_word, deck.source_language, translations, deck.target_language)
#                 # db_helper.add_word(card.source_word, deck.source_language, translations, deck.target_language)
                
            
#             #return Deck(source_word, source_language, target_language)
#     return "No words provided"

@app.get("/languages/")
def get_languages():
    languages = [ v["language"] for k, v in new_languages.items()  ]
    return languages

@app.get("/languages/")
def get_languages_short():
    language_abbreviations = [ k for k, v in languages.items() ]
    return language_abbreviations

@app.post("/upload/")
def upload_deck(deck: UploadedDeck):
    print("uploaded")
    for e in deck:
        print(e)
    pass
    

@app.get("/cards/") 
def get_cards(source_language: str, target_language: str, count: int):
    # logging.info(f"get_cards called to get {count} in total")
    logger.info(f"getting cards")
    deck = Deck(source_language, target_language)
    deck.build_deck_from_db(count)
    print(deck.deck)
    return deck.deck

@app.post("/refresh/") 
def update_db(refresh: Refresh):
    logger.info(f"update_db has been called for sl {refresh.source_language} and tl {refresh.target_language}")
    deck = Deck(refresh.source_language, refresh.target_language)
    deck.build_deck_from_duo()
    deck.upload_deck()
    logger.info("Deck uploaded")
    return "fart"
    
@app.post("/results/")
def update_results(cards: List[Result]):
    logger.info(f"data: {cards[0]}")
    db = Database()
    db.update_words(cards)
    return "all good"


    
    
