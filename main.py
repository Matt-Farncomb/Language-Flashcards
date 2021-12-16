from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import os
import json

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# return a list of all available audio clips
@app.get("/")
def get_available_audio(language ="Finnish"):
    arr = []
    audio_clips = os.listdir(f"Audio/{language}")
    audio_info = { language: arr }
    for file_name in audio_clips:
        split = file_name.split("_")
        # for alphabet
        dict = {
                "sound":f"Audio/{language}/{file_name}",
                "letter": split[0],
                "example": split[1],
                "translation": split[2].split(".")[0]
            }
        # for numbers
        # for days and months
        # for colours
        arr.append(dict)
    return audio_info

@app.get("/languages")
def languages():
    languages = os.listdir(f"Audio")
    return languages
        


