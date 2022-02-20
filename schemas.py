from pydantic import BaseModel

class CardTest(BaseModel):
    card_id: str
    wrong_count: str
