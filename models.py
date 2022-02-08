from fnmatch import translate
from peewee import CharField, IntegerField, ForeignKeyField, DateTimeField # type: ignore
from peewee import * 

from app import db 

class BaseModel(Model): # type: ignore
    class Meta:
        database = db

# class User(BaseModel):
#    username = CharField()
#    password = CharField() 

class WordInfo(BaseModel):
    last_tested = DateTimeField()
    answered_correctly_count = IntegerField()
    answered_wrong_count = IntegerField()
   
class Word(BaseModel):
    word = CharField()
    language = CharField()
    parent = ForeignKeyField('self', null=True, backref='translations')
    
    
    #¤translation = ForeignKeyField("Word", related_name='translations')
    #translation = ManyToManyField('self', backref='translations')
    
# class Translation(BaseModel):
#     translation = CharField()
#     language = CharField()
#     word = ForeignKeyField(Word, null=True, backref='translations')
    
    
# class Translation(BaseModel):
#     source_word = ForeignKeyField(Word, related_name='source')    
#     translation = ForeignKeyField(Word, related_name='source')
    
# class Translation(BaseModel):
#     word = ForeignKeyField(Word, related_name='translations')
#     translated_word = CharField()
#     language = CharField()

 
