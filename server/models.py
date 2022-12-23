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
    is_custom_word = BooleanField(null=True)
    parent = ForeignKeyField('self', null=True, backref='translations')

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