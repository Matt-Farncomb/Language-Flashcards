from fastapi import Query, Request, Response, UploadFile, File
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os
from typing import List
from app import app
from deck import Deck, languages, new_languages
from database import Database
from schemas import Result, Refresh, UploadedDeck, BlobTest
from fastapi.middleware.cors import CORSMiddleware
from base_logger import logging
from fastapi.responses import FileResponse
import base64

import librosa  
import soundfile as sf

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

data_test = ""

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
    new_deck = Deck(deck.source_language, deck.target_language)
    new_deck.add_custom_deck(deck)
    new_deck.upload_deck()
    print("uploaded")
    # for e in deck:
    #     print(e)
    # pass
    
# @app.post("/uploadTest/")
# def upload_deck_test(deck: BlobTest):
#     # new_deck = Deck(deck.source_language, deck.target_language)
#     # new_deck.add_custom_deck(deck)
#     # new_deck.upload_deck()
#     print("uploaded")
#     # for e in deck:
#     #     print(e)
#     # pass
    

@app.get("/cards/") 
def get_cards(source_language: str, target_language: str, count: int):
    # logging.info(f"get_cards called to get {count} in total")
    logger.info(f"getting cards")
    deck = Deck(source_language, target_language)
    deck.build_deck_from_db(count)
    # print("??sdfdfsdfsdsdffsd")
    # print(deck.deck)
    for card in deck.deck:
        print(card.source_word.word)
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

from sys import getsizeof

def blob_to_wav(blob):
    # do stuff:
    # c
   
    pass

# remove silence
def trimmed_wav():
    # https://www.tutorialexample.com/python-remove-silence-in-wav-using-librosa-librosa-tutorial/
    # something like this: clip = librosa.effects.trim(audio, top_db= 10)
    pass 
      


@app.post("/uploadTest")
async def create_file(source_language: List[str], target_language: List[str], source_word: List[str], translation: List[str], file: List[UploadFile] = File(...)):
# async def create_file(file: UploadFile = File(...)):
    audios = []
    # print(source_word)
    # print(translation)
    # print(file)
    
    testFiles = []
    
    for e in range(len(file)):
        contents = await file[e].read()
        filename = file[e].filename
        with open(filename, 'wb') as f:
            f.write(contents)
        # new_filename = f"{source_word}_{translation}"
        os.rename(filename, f'{filename}.wav') 
        audio, sr = librosa.load(f'{filename}.wav', sr= 8000, mono=True)
        clip = librosa.effects.trim(audio, top_db=30)
        sf.write('poo.wav', clip[0], sr)
        
        testFiles.append(contents)
    
    new_deck = Deck("fi", "es")
    new_deck.add_custom_deck_two(source_word, translation, testFiles)
    new_deck.upload_deck()
    # print(new_deck.deck)
    return "new_deck.deck"

    
    
        

    # form =  await file.form()
    # print(form)
    # for k,v in form.items():
    #     print(v)
    # print(file.query_params["source_word"])
    # filename = form["audio"].filename
    # audio_files = form["audio"]
    # print(audio_files)
    # source_words = form["source_word"]
    # translations = form["translation"]
    # print(source_words)
    # print(translations)
    
    # contents = await file[0].read()
    # filename = file[0].filename
    # with open(filename, 'wb') as f:
    #         f.write(contents)
    # audios.append(contents)
    # thingy = {"file": audios[0]}
    cards = []
    
    # encoded = ""    
    # with open(filename, "rb") as f:
    #     encoded = base64.b64encode(f.read()).decode('utf-8')
        
    for e in range(len(file)):
        card_dict = {}
        contents = await file[e].read()
        filename = file[e].filename
        with open(filename, 'wb') as f:
            f.write(contents)
        with open(filename, "rb") as f:
            encoded = base64.b64encode(f.read()).decode('utf-8')
            card_dict["file"] = encoded 
            card_dict["source_word"] = source_word[e]
            card_dict["translation"] = translation[e]
            cards.append(card_dict)
        
        
        
    # print(getsizeof(encoded))
        # return base64.b64encode(f.read()).decode('utf-8')
    # encoded = base64.b64encode(contents)
    # print(encoded)
    
    
    
 
    
   
    # print(form.keys)
    # print(len(contents))
    # print(form["file"])
    # global data_test
    # data_test = contents
    
    # new_deck = Deck(deck.source_language, deck.target_language)
    # new_deck.add_custom_deck(deck)
    # new_deck.upload_deck()
    {"source_word":source_word[0], "translation": translation[0]}
    header = {"meta_data":  source_word[0] }
    return cards
    # return Response(content=audios[0], headers=header)


    # form = await request.form()
    # filename = form["upload_file"].filename
    # contents = await form["upload_file"].read()
    # with open(filename, 'wb') as f:
    #     f.write(contents)
    # return filename

# @app.get("/getTest")
# async def getTest():
#     global data_test
#     print(len(data_test))
    
#     return Response(data_test)
    
