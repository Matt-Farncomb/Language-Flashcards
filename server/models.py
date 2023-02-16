from fnmatch import translate
from peewee import CharField, IntegerField, ForeignKeyField, DateTimeField # type: ignore
from peewee import * 

from app import db 


class BaseModel(Model): # type: ignore
    class Meta:
        database = db
        
# class Difficulty(IntegerField):
    
# Need to change word model to have a translation language.
# This is because otherwise it is impossible to retrive words from ths sever with a translation language being a part of the request
# So, right now if i say spanish to finnihs, it can only really check for spanish, not the finnish translations.
# This means the same word can be in the server twice
# This can be kinda avoided with another class where it is just the word string, not the translation link, then the Word Model is linked to that string thing
    
class WordModel(BaseModel):
    word = CharField()
    language = CharField()
    is_custom_word = BooleanField(null=True)
    parent = ForeignKeyField('self', null=True, backref='translations')

# TODO: WIP
class WordStringModel(BaseModel):
    word_string = CharField()
    word = word = ForeignKeyField(WordModel, primary_key=True)

class Audio(BaseModel):
    filename = BlobField(null=True)
    #word = ForeignKeyField(WordModel, null=True, backref='file', primary_key=True)
    word = ForeignKeyField(WordModel, null=True, primary_key=True)

class WordInfo(BaseModel):
    last_tested = DateTimeField(null=True)
    used_count = IntegerField(null=True, default=0)
    answered_wrong_count = IntegerField(null=True, default=0)
    word = ForeignKeyField(WordModel, primary_key=True)
    # difficulty = IntegerField(null=True, default=0)
    
    def difficulty(self):
        if self.answered_wrong_count == 0:
            return "Medium"
        elif self.answered_wrong_count > 0:
            return "Hard"
        return "Easy"