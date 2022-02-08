from fnmatch import translate
from peewee import CharField, IntegerField, ForeignKeyField, DateTimeField # type: ignore
from peewee import * 

from app import db 

class BaseModel(Model): # type: ignore
    class Meta:
        database = db
    
class WordModel(BaseModel):
    word = CharField()
    language = CharField()
    parent = ForeignKeyField('self', null=True, backref='translations')

class Audio(BaseModel):
    filename = CharField()
    word = ForeignKeyField(WordModel, null=True, backref='file')

class WordInfo(BaseModel):
    last_tested = DateTimeField()
    answered_correctly_count = IntegerField()
    answered_wrong_count = IntegerField()
    word = ForeignKeyField(WordModel, null=True, backref='info')
    
    def difficulty(self):
        return self.answered_correctly_count - self.answered_wrong_count