from gettext import translation
from app import db
from models import *


def get_words(word_count, language):
    db.connect()
    words = WordModel.select().where(WordModel.language == language).order_by(WordModel.difficulty).limit(word_count)
    return words
    
def word_answered_wrong(word, language):
    db.connect()
    update = WordModel.get(WordModel.word == word, WordModel.language == language)
    update.answered_wrong_count += 1
    update.save()

def word_answered_correctly(word):
    db.connect()
    update = WordModel.get(WordModel.word == word)
    update.answered_correctly_count += 1
    update.save()

def get_difficult_words(date):
    db.connect()
    words = WordModel.select().where(WordModel.answered_wrong_count > WordModel.answered_correctly_count)
    return words

def create_tables():
    db.connect(reuse_if_open=True)
    models = Model.__subclasses__()
    db.drop_tables(models)
    db.create_tables(models)
           
def add_word(source, source_language, translations, translation_language):
    create_tables()
    word = WordModel(word=source.word, language=source_language)
    word.save()
    for translation in translations:
          new_word = WordModel(word=translation.word, parent=word, language=translation_language)
          new_word.save()
         #word.translations.add(new_word)
    # for translation in translations:
    #     # create a translation word
    #     new_word = Word(word=translation, language=translation_language)
    #     new_word.save()
    #     new_translation = Translation(source_word=word, fart=new_word)
    #     new_translation.save()
        
        #new_trans.save()
        # at this translation to the list of translations
        
        # now add the source word as a possible translation to the new trans word
        
        
    # for word in word.translations:
    #     print(f"word {word.word}")
    # for word in Word.select():
    #     print(f"word {word.word}")
    db.close()
    
    
    
    # source_new_word = Word(word=source, language=source_language)
    # for translation in translations:
    #     translation_new_word = Word(word=translation, language=translation_language, translation=source_new_word)
    #     source_new_word.translation = translation_new_word
    # new_word.save()
