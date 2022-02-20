from pydantic import BaseModel


class CardTest(BaseModel):
    id: int
    wrong_count: int
    