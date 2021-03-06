from fnmatch import translate
from peewee import CharField, IntegerField, ForeignKeyField, DateTimeField # type: ignore
from peewee import * 

from app import db 

class BaseModel(Model): # type: ignore
    class Meta:
        database = db
        
# class Difficulty(IntegerField):
    
    
class WordModel(BaseModel):
    word = CharField()
    language = CharField()
    parent = ForeignKeyField('self', null=True, backref='translations')

class Audio(BaseModel):
    filename = CharField()
    word = ForeignKeyField(WordModel, null=True, backref='file')

class WordInfo(BaseModel):
    last_tested = DateTimeField(null=True)
    used_count = IntegerField(null=True, default=0)
    answered_wrong_count = IntegerField(null=True, default=0)
    word = ForeignKeyField(WordModel, backref='info')
    difficulty = IntegerField(null=True, default=0)
    
    # def get_difficulty(self):
    #      return self.answered_correctly_count - self.answered_wrong_count