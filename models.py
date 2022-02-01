from peewee import CharField, ManyToManyField # type: ignore
from peewee import * 

from app import db 

class BaseModel(Model): # type: ignore
    class Meta:
        database = db

class User(BaseModel):
   username = CharField()
   password = CharField()
   
class Word(BaseModel):
    word = CharField()
    users = ManyToManyField(User, backref='courses')
    
