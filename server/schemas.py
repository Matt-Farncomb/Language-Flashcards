from pydantic import BaseModel

class Result(BaseModel):
    id: int
    wrong_count: int

class Refresh(BaseModel):
    source_language: str
    target_language: str