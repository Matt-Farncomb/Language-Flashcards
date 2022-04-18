from pydantic import BaseModel
from typing import List

class Result(BaseModel):
    id: int
    wrong_count: int

class Refresh(BaseModel):
    source_language: str
    target_language: str

class UploadedCard(BaseModel):
    source_word: str
    translation: str
    audio: bytes

class UploadedDeck(BaseModel):
    source_language: str
    target_language: str
    cards: List[UploadedCard]
    
class BlobTest(BaseModel):
    blob: bytes
  

    