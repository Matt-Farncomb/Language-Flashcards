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
    
    # will result in the same word in db multiple times
    # we want each word to be unique
    def upload_deck(self, deck):
        
        fields = [ WordModel.word, WordModel.language, WordModel.parent ]
        # cards_added = set()
        
        # translations = []
        # data_to_add = ("", []) # one source word and many translatiojns
        # temp = {
        #     "word":"",
        #     "translations":[]
        # }
        # for card in deck:
        #     word = card.source_word
        #     if word not in cards_added:
        #         if len(cards_added) != 0:
        #             pass
        #         cards_added.add(card.source_word)
        #         temp["word"] = card.source_word
        #         temp["translations"].append(card.translation)
                
        #     else:
        #         temp["translations"].append(card.translation)
            
        
        # data = []
        
        card_ids = {}
        
        for card in deck.deck:
            if card.word not in card_ids:
                card_id = WordModel.create(word=card.word, language=card.language)
                card_ids[card.word] = card_id.id
            data = []
            data.append(c.word, c.language)
            for c in card.translations:
                # entry = WordModel.create(
                #     source_word=c.word, 
                #     language=c.language,
                #     parent=card.source_word.word
                # )
                data.append(c.word, c.language, card.source_word.word)
            # entry.save()
            with self.db.atomic():
                WordModel.insert_many(data, fields=fields).execute()
        
        # data = [ 
        #     ( card.translation.word, card.source_word.language, card.source_word.word ) 
        #     for card in deck.deck 
        # ]  
        # for card in deck.deck:
        #     data.append(
        #         card.translation.word,
        #         card.source_word.word,
        #         card.source_word.word
        #     )
        
        # with self.db.atomic():
        #     WordModel.insert_many(data, fields=fields).execute()
            
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
    
    def get_words(self, word_count, language):
        #query = WordModel.select().where(WordModel.language == language).order_by(WordModel.info.difficulty).limit(word_count)
        #query = WordModel.select().where(WordModel.language == language).order_by(WordInfo.difficulty).limit(word_count)
        # query = WordModel.select().where(WordModel.language == language).limit(word_count)
        #print(f"language: {language}")
        query = WordModel.select().where(WordModel.language == language).limit(word_count)
        #print(f"word: {query[1].word}")
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
        
    