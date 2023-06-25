from fastapi import Query, Request, Response, UploadFile, File, Form
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os
from typing import List
from app import app
from deck import Deck, languages, new_languages, language_by_string
from database import Database
from schemas import Result, Refresh, UploadedDeck, BlobTest, Update, Edit, AuthData, SignUp
from fastapi.middleware.cors import CORSMiddleware
from base_logger import logging
from fastapi.responses import FileResponse
import base64
import json

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

valid_languages = ["Spanish", "Finnish", "Vietnamese", "English"]

def get_js_files(dir: str):
    js_files = []
    for path, dirs, fnames in os.walk(f"..\client\static\js\dest"):
        for filename in [f for f in fnames if f.endswith(".js")]:
            newPath = path.split("static")[1]+"\\\\"
            js_files.append(f"{newPath}{filename}")
    return js_files

@app.get("/get_languages")
def get_languages():
    return json.dumps(valid_languages)

@app.get("/", response_class=HTMLResponse)
def read_item(request: Request):  

    lang = [ v["language"] for k, v in new_languages.items()  ]
    
    nav_left_button = {
        "link": "#",
        "button":"Table"
    }
    
    return templates.TemplateResponse("home.html", {"request": request, "lang": lang, "js_files": get_js_files("flashCards"), "nav_left_button": nav_left_button})

@app.get("/table/", response_class=HTMLResponse)
def table(request: Request, source_language: str, target_language: str, is_custom: bool):  

    db = Database()
    words = db.get_words(0, language_by_string[source_language], is_custom)
    
    nav_left_button = {
        "link": "../",
        "button":"Home"
    }
    
    languages = {
        "type": "Custom" if is_custom else "Duo Lingo",
        "source":source_language,
        "target":target_language
    }
    
    return templates.TemplateResponse("table.html", {"request": request, "words": words, "js_files": get_js_files("table"),  "nav_left_button": nav_left_button, "languages": languages} )

def validate(content: str) -> bool:
    for char in content:
        if char is None or not char.isalpha() or char == '':
            return False
    return True

@app.post("/login/")
def login(data: AuthData):
    return f"Logged in {data.username}"

@app.post("/sign_up/")
def login(data: SignUp):
    return f"signed up in {data.firstname}"

@app.get("/get_deck/") 
def get_deck(source_language: str, target_language: str, count: int):
    logger.info(f"getting deck")
    deck = Deck(source_language, target_language)
    deck.build_deck_from_db(count, 1)
    return deck.deck


@app.post("/results/")
def update_results(result:Result):
    db = Database()
    db.update_word(result)
    return "all good"

# remove silence
def trimmed_wav():
    # https://www.tutorialexample.com/python-remove-silence-in-wav-using-librosa-librosa-tutorial/
    # something like this: clip = librosa.effects.trim(audio, top_db= 10)
    pass 

@app.post("/edit")
async def edit(id: str = Form(...), source_word: str = Form(...), translations: str = Form(...), file: UploadFile = File(...)):
    print(id)
    translations = json.loads(translations)
    print(f"translations: {translations}")
    print(file.filename)
    testfiles = []
    contents = await file.read()
    filename = file.filename
    with open(filename, 'wb') as f:
        f.write(contents)
    testfiles.append(contents)
    db = Database()
    db.update_audio(id, testfiles)
    db.update_word(id, source_word, translations)
    return "id"

@app.post("/updateAudio/")
async def update_audio(id: List[int], audio: List[UploadFile] = File(...)):
    db = Database()
    print(id)
    print("audio")
    testfiles = []
    for e in range(len(audio)):
        contents = await audio[e].read()
        filename = audio[e].filename
        with open(filename, 'wb') as f:
            f.write(contents)
        
        testfiles.append(contents)
    db.update_audio(id, testfiles)


@app.post("/upload_deck")
async def upload_deck(source_language: List[str], target_language: List[str], source_word: List[str], translations: List[str], file: List[UploadFile] = File(...)):

    loaded_translations = [ json.loads(translation) for translation in translations ]
    testFiles = []

    for e in range(len(file)):
        contents = await file[e].read()
        filename = file[e].filename
        with open(filename, 'wb') as f:
            f.write(contents)

        testFiles.append(contents)
    new_deck = Deck(source_language[0], target_language[0])
    new_deck.add_custom_deck_two(source_word, loaded_translations, testFiles)
    new_deck.upload_deck(is_custom=True)
    
    if os.path.exists(filename):
        os.remove(filename)
    else:
        print(f"{filename}does not exist")
   
    return "new_deck.deck"
