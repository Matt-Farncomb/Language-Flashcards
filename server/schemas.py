from pydantic import BaseModel
from typing import List
from fastapi import UploadFile

class Result(BaseModel):
    id: int
    is_correct: bool

class Refresh(BaseModel):
    source_language: str
    target_language: str

class UploadedCard(BaseModel):
    source_word: str
    translation: List[str]
    audio: bytes

class UploadedDeck(BaseModel):
    source_language: str
    target_language: str
    cards: List[UploadedCard]
    
class BlobTest(BaseModel):
    blob: bytes
    
class Edit(BaseModel):
    id: str
    source_word: str    

class Update(BaseModel):
    id: str
    source_word: str
    # translations: List[str]

class AuthData(BaseModel):
    username: str
    password: str
    
class SignUp(AuthData):
    firstname: str
    lastname: str


    