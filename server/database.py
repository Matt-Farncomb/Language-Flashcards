#from app import db
from peewee import *
from models import WordModel, Audio, WordInfo
#from deck import Deck
from app import db

from base_logger import logging
logger = logging.getLogger(__name__)

class Database:
    def __init__(self) -> None:
        #self.db = SqliteDatabase('words.db')
        self.db = db
        # self._connect()
    
    def __enter__(self):
        self.db.connect()
    
    def __exit__(self):
        self.db.close()
    
    def refresh_db(self, source_language, target_language):
        pass
    
    # def upload_from_duo():
        
        
    # will result in the same word in db multiple times
    # we want each word to be unique
    def upload_deck(self, deck):
        self.create_tables()
        fields = [ WordModel.word, WordModel.language, WordModel.parent ]
        info_fields = [ WordInfo.word ]
        info_data = []
        card_ids = {}
        
        logger.info(f"Deck will be uploaded")
        for card in deck:
            logger.info(f"Uploading {card.source_word.word,}")
            if card.source_word not in card_ids:
                card_id = WordModel.create(word=card.source_word.word, language=card.source_word.language)
                WordInfo.create(word=card_id)
                card_ids[card.source_word] = card_id.id
            data = []
            for c in card.translations:
                data.append( (c.word, c.language, card_ids[card.source_word]) )
            with self.db.atomic():
                WordModel.insert_many(data, fields=fields).execute()
                #WordInfo.insert_many(info_data, fields=info_fields).execute()
    
    def connect(self):
        self.db.connect(reuse_if_open=True)
        
    def close(self):
        self.db.close()
    
    def get_words(self, word_count, language):
        #query = WordModel.select().where(WordModel.language == language).order_by(WordModel.info.difficulty).limit(word_count)
        #query = WordModel.select().where(WordModel.language == language).order_by(WordInfo.difficulty).limit(word_count)
        query = WordModel.select().where(WordModel.language == language).limit(word_count)
        return query
    
    def word_answered_wrong(word_id, count):
        update = WordModel.get(WordModel.id == word_id)
        update.answered_wrong_count += count
        update.used_count += 1
        update.save()

    # def word_used(word_id):
    #     update = WordModel.get(WordModel.id == word_id)
    #     update.used_count += 1
    #     update.save()

    def get_difficult_words(date):
        words = WordModel.select().where(WordModel.answered_wrong_count > WordModel.answered_correctly_count)
        return words

    def create_tables(self):
        #models = Model.__subclasses__()
        models = [ WordModel, Audio, WordInfo ]
        #print(models)
        self.db.drop_tables(models)
        self.db.create_tables(models)
    
    def update_word(self, card):
        self.word_answered_wrong(card.id, card.wrong_count)
        
    def update_words(self, cards):
 
        def update_query(card):
            query = WordInfo.select().join(WordModel).where(WordModel.id == card.id).get()
            query.answered_wrong_count = card.wrong_count
            return query
        
        data = [ update_query(card) for card in cards ]
  
        WordInfo.bulk_update(data, fields=[WordInfo.answered_wrong_count])
        
       
            
    def add_word(self, source, source_language, translations, translation_language):
        self.create_tables()
        word = WordModel(word=source.word, language=source_language)
        word.save()
        for translation in translations:
            new_word = WordModel(word=translation.word, parent=word, language=translation_language)
            new_info = WordInfo(None, 0, 0, new_word, 0)
            new_word.save()
            new_info.save()
            
       
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
        #self.db.close()
        
    