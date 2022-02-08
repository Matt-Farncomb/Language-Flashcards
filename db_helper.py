from gettext import translation
from app import db
from models import *

# def some_db_shit():
#     db.connect()
#     db.create_tables([User])
#     uncle_bob = User(name='Bob')
#     uncle_bob.save()
#     grandma = User.get(User.name =='Bob')
#     print(grandma.name)
#     db.close()

# user chooses two language.
# each side has one the correpsonding word for the chosen lanaguge
# all these words are taken  from the db
# these words are put in the db by a refresh button of some sort where the user gets all words
# ... from the source language duo vocab and then finds those words that exist in the other langauge duo vocab
def get_words(word_count, source_language, target_language):
    db.connect()
    return Word.select()
    # for word in Word.select():
    #     print(word)
    
def word_answered_wrong(word, language):
    db.connect()
    update = Word.get(Word.word == word, Word.language == language)
    update.answered_wrong_count += 1
    update.save()

def word_answered_correctly(word):
    db.connect()
    update = Word.get(Word.word == word)
    update.answered_correctly_count += 1
    update.save()

def get_difficult_words(date):
    db.connect()
    words = Word.select().where(Word.answered_wrong_count > Word.answered_correctly_count)
    return words
           
def add_word(source, source_language, translations, translation_language):
    # create the source word
    db.connect()
    for word in Word.select():
        print(f"penis {word.word}")
    db.drop_tables([Word])
    db.create_tables([Word])
    word = Word(word=source.word, language=source_language)
    word.save()
    # trans_word = Word(word=translation, parent=word, language=translation_language)
    # trans_word.save
    for translation in translations:
          new_word = Word(word=translation.word, parent=word, language=translation_language)
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
    for word in Word.select():
        print(f"word {word.word}")
    db.close()
    
    
    
    # source_new_word = Word(word=source, language=source_language)
    # for translation in translations:
    #     translation_new_word = Word(word=translation, language=translation_language, translation=source_new_word)
    #     source_new_word.translation = translation_new_word
    # new_word.save()
