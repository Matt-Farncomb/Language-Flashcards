#from app import db
from peewee import *
from models import WordModel, Audio, WordInfo
from deck import Deck

class Database:
    def __init__(self) -> None:
        self.db = SqliteDatabase('words.db')
        # self._connect()
    
    def __enter__(self):
        self.db.connect()
    
    def __exit__(self):
        self.db.close()
    
    def refresh_db(self, source_language, target_language):
        pass
    
    def upload_deck(self, deck):
        
        # data = []
        fields = [ WordModel.source_word, WordModel.language, WordModel.parent ]
        data = [ 
            ( card.translation.word, card.source_word.word, card.source_word.word ) 
            for card in deck.deck 
        ]  
        # for card in deck.deck:
        #     data.append(
        #         card.translation.word,
        #         card.source_word.word,
        #         card.source_word.word
        #     )
        
        with self.db.atomic():
            WordModel.insert_many(data, fields=fields).execute()
            
        # for card in deck.deck:
        #     entry = WordModel.create(
        #         source_word=card.translation.word, 
        #         language=card.source_word.word,
        #         parent=card.source_word.word
        #     )
        #     entry.save()
    
    def connect(self):
        self.db.connect(reuse_if_open=True)
        
    def close(self):
        self.db.close()
    
    def get_words(word_count, language):
        print("connecting")
        #query = WordModel.select().where(WordModel.language == language).order_by(WordInfo.difficulty).limit(word_count)
        query = WordModel.select().where(WordModel.language == language).limit(word_count)
        print(query)
        # words = [ word.word for word in query ]
        return query
    
    def word_answered_wrong(word, language):
        update = WordModel.get(WordModel.word == word, WordModel.language == language)
        update.answered_wrong_count += 1
        update.save()

    def word_answered_correctly(word):
        update = WordModel.get(WordModel.word == word)
        update.answered_correctly_count += 1
        update.save()

    def get_difficult_words(date):
        words = WordModel.select().where(WordModel.answered_wrong_count > WordModel.answered_correctly_count)
        return words

    def create_tables(self):
        #models = Model.__subclasses__()
        models = [ WordModel, Audio, WordInfo ]
        print(models)
        self.db.drop_tables(models)
        self.db.create_tables(models)
            
    def add_word(self, source, source_language, translations, translation_language):
        self.create_tables()
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
        self.db.close()
        
    