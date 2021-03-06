import duolingo
from decouple import config # type: ignore
from bs4 import BeautifulSoup # type: ignore
import requests 
from typing import List
from database import Database
import threading, queue

from base_logger import logging
logger = logging.getLogger(__name__)


languages = {
    "es":4,
    "fi":17,
    "en":3,
    "vi":0
}

language_by_string = {
    "Spanish":"es",
    "Finnish":"fi"
}

new_languages = {
    "es": {
        "code":4,
        "language":"Spanish"
    },
    "fi": {
        "code":17,
        "language":"Finnish"
    },
    "en": {
        "code":3,
        "language":"English"
    },
    "vi": {
        "code":0,
        "language":"Vietnamese"
    }
}

# lingo  = duolingo.Duolingo(config('DUO_USER'), config('DUO_PWORD'))


class Word:
    #def __init__(self, word: str, language: str, voice: Voice):
    def __init__(self, word: str, language: str):
        self.word = word
        # self.voice = voice
        # self.audio_url = self.voice.speak(word)
        self.language = language


class Card:
    def __init__(self, id, source_word: Word, translations :List[Word]):
        self.id = id
        self.source_word = source_word
        self.translations = translations  
    
    def addTranslation(self, newTranslation):
        self.translations.append(newTranslation)

class Deck:
    def __init__(self, source_language, target_language):
        self.source_language = source_language
        self.target_language = target_language
        # self.vocab = [] # thisbegins empty because user can build deck from requested vocab
        # self.target_vocab = []
        self.deck = []
        self.deck_type = None
        self.db = Database()
        self.logged_in = False
        self.lingo = None
        
        # For debugging only
        #self.db.create_tables()
        
        
        # self.vocab = self._get_vocab(source_language)
        # self.target_vocab = self._get_vocab(source_language)
      
    def upload_deck(self):
        self.db.upload_deck(self.deck)
        
    def __get_words_from_db(self, count: int,):
        return self.db.get_words(count, self.source_language) # type: ignore
    
    def build_deck_from_db(self, count):
        if len(self.deck) != 0:
            raise Exception(f"Deck already created from {self.deck_type}")
        else:
            cards = []
            #print("word")
            words = self.__get_words_from_db(count)
            print(f"words: {words}")
            for word in words:
                #??print(f"word: {word}")
                new_word = Word(word.word, word.language)
                #print(f"id: {word.id}")
                new_card = Card(word.id, new_word, [])
                #?? new_word = Word(word.word, word.language)
                for trans in word.translations:
                    new_card.addTranslation(trans)
                    #new_trans = Word(trans, trans.language)
                    # new_card = Card(new_word, new_trans)
                cards.append(new_card)
            self.deck = cards
    
    def build_deck_from_duo(self):
        if len(self.deck) != 0:
            raise Exception(f"Deck already created from {self.deck_type}")
        else:
            print("called")
            #self.db.create_tables()
            vocab = self.__get_vocab(self.source_language)
            # self.target_vocab = self._get_vocab(self.target_language)
            self.deck = self.__create_card_deck(vocab)
            self.deck_type = "Duo"
    
    def build_deck_from_user_input(self, words_to_add):
        pass    
    
    
    def __run_thread(self, q, cards):
        while True:
            word = q.get()
            logger.info(f"getting:{word}")
            self.create_card_for_word(word, cards)
            logger.info(f"got:{word}")
            q.task_done()
            
            
    def __spawn_threads(self, words):
        num_threads = 10
        q = queue.Queue(len(words))
        cards = []
        for i in range(num_threads):
            logger.info(f"launching thread")
            thread = threading.Thread(target=self.__run_thread, args=[q, cards])
            thread.start()
        for word in words:
            #logger.info(f"putting{word}")
            q.put(word)
        q.join()
        logger.info("finished putting")
        return cards
    
    
    # def run_thread(self, word, cards):
    #     print(f"running thread on: {word}")
    #     thread = threading.Thread(
    #         target=self.create_card_for_word, 
    #         args=[word, cards]
    #     )
    #     thread.start()
    #     return thread
    
    # def spawn_threads(self, words):
    #     cards = []
    #     threads = []
    #     break_int = 0
    #     for word in words:
    #         break_int += 1
    #         if break_int > 10:
    #             break
    #         else:
    #             print(word)
    #             thread = self.run_thread(word, cards)
    #             threads.append(thread)
                
    #     # threads = [ self.run_thread(word, cards) for word in words ]
    #     for thread in threads:
    #         thread.join()

    #     return cards
    
    
    
    def __create_card_deck(self, source_words: List[str]) -> List[Card]:
        cards = []
        # cards.append(self.create_card_for_word("t??m??"))
        # cards.append(self.create_card_for_word("tytt??"))
        # cards.append(self.create_card_for_word("sin??"))
        # print(f"cards: {cards}")
        #print(f"one word is: {source_words[1]}")
        cards = self.__spawn_threads(source_words)
        print(f"cards: {cards}")
        return cards
        
        # for word in source_words:
        #     print(f"adding: {word}")
        #     cards.append(self.create_card_for_word(word))
        # return cards
    
    def __get_translations(self, word: str) -> List[str]:
        translations: List[str] = []
        # get int representing langauge on webxicon
        l1 = languages[language_by_string[self.source_language]]
        l2 = languages[language_by_string[self.target_language]]
        # scrape all translations of word from webxicon
        url = f"http://webxicon.org/search.php?q={word}&l={l1}&l2={l2}"
        req = requests.get(url, allow_redirects=True).text
        soup = BeautifulSoup(req, 'html.parser')
        for row in soup.find_all('tr'):
            for translation in row.find_all('a'):
                if translation.string != None:
                    translations.append(translation.string)    
        return translations     
    
    def __get_matched_translations(self, translations: List[str]) -> List[Word]:
        target_language_vocab = self.__get_vocab(self.target_language)
        translated_words: List[Word] = []
        for word in target_language_vocab:
            temp = []
            for translation in translations:
                if translation == word and translation not in temp:
                    translated_word = Word(translation, self.target_language)
                    translated_words.append(translated_word)
                    temp.append(translation)
        
        return translated_words
    
    def __get_vocab(self, language):
        lingo  = self.__duo_login()
        languageAbreviation = language_by_string[language]
        vocab = lingo.get_vocabulary(languageAbreviation)
        words = [ word["word_string"] for word in vocab["vocab_overview"] ]
        return words
        # for word in words:
        #     card = Card()
    def __duo_login(self):
        if self.logged_in:
            return self.lingo
        else:
            self.lingo  = duolingo.Duolingo(config('DUO_USER'), config('DUO_PWORD'))
            self.logged_in = True
            return self.lingo
            
    # def create_cards_for_word(self, source_word) -> List[Card]: 
    #     source = Word(source_word, self.source_language)
    #     translations: List[str] = self._get_translations(source_word)
    #     matched_translations: List[Word] = self._get_matched_translations(translations)
    #     print(matched_translations)
    #     cards = [ Card(source, translation) for translation in matched_translations ]
    #     return cards 
    
    # will be easier to insert into db
    # each card will have the one source word and all the possible translations and possible answers
    # makes more sense because like le and la in spansih  just mean the. So that should just be one card.
    def old_create_card_for_word(self, source_word) -> Card: 
        source = Word(source_word, self.source_language)
        translations: List[str] = self.__get_translations(source_word)
        matched_translations: List[Word] = self.__get_matched_translations(translations)
        card = Card(None, source, [])
        for trans in matched_translations:
            card.translations.append(trans)
        return card
    
    def create_card_for_word(self, source_word, cards) -> Card: 
        source = Word(source_word, self.source_language)
        translations: List[str] = self.__get_translations(source_word)
        matched_translations: List[Word] = self.__get_matched_translations(translations)
        card = Card(None, source, [])
        for trans in matched_translations:
            card.translations.append(trans)
        cards.append(card)
        #return card
    
    
    


