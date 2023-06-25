# import duolingo


from decouple import config # type: ignore
from bs4 import BeautifulSoup # type: ignore
import requests
from typing import List, BinaryIO 
from database import Database
import threading, queue

from base_logger import logging
logger = logging.getLogger(__name__)

import base64

duo_only_languages = ["vi", "fi",]

languages = {
    "es":4,
    "fi":17,
    "en":3,
    "vi":0
}

language_by_string = {
    "Spanish":"es",
    "Finnish":"fi",
    "English":"en",
    "Vietnamese":"vi"
    
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
    def __init__(self, word: str, language: str, voice: BinaryIO=None ):
        self.word = word
        self.voice = voice
        # self.audio_url = self.voice.speak(word)
        self.language = language


class Card:
    def __init__(self, id, source_word: Word, translations :List[Word], difficulty=0):
        self.id = id
        self.source_word = source_word
        self.translations = translations
        self.difficulty =  difficulty
    
    def addTranslation(self, newTranslation):
        self.translations.append(newTranslation)
    
    def hasTranslations(self):
        return len(self.translations) != 0

class Deck:
    def __init__(self, source_language, target_language):
        self.source_language = source_language if source_language in new_languages else language_by_string[source_language]
        self.target_language = target_language if target_language in new_languages else language_by_string[target_language]
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
   
        
    def add_custom_deck(self, custom_cards):
        for word in custom_cards.cards:
            # print(word)
            new_word = Word(word.source_word, custom_cards.source_language)
            new_translation = Word(word.translation, custom_cards.target_language)
            new_card = Card(None, new_word, new_translation)
            self.deck.append(new_card)
        # print(self.deck)
    
    def add_custom_deck_two(self, source_words, translations, audio_files):
        # print(f"source_words: {source_words}")
        # print(f"audio_files: {audio_files}")
        for i in range(len(source_words)):
            new_word = Word(source_words[i], self.source_language, audio_files[i])
            new_translations = []
            for e in translations[i]:
                print(f"sl: {self.source_language}")
                print(f"tl: {self.target_language}")
                new_translations.append(Word(e, self.target_language))
            new_card = Card(None, new_word, new_translations)
            self.deck.append(new_card)
      
    def upload_deck(self, is_custom):
        self.db.upload_deck(self.deck, is_custom)
        
    def __get_words_from_db(self, count: int, is_custom):
        print(f" getting {self.source_language} words")
        print(f" target is {self.target_language} words")
        return self.db.get_words(count, self.source_language, is_custom) # type: ignore
    
    def build_deck_from_db(self, count, is_custom):
        if len(self.deck) != 0:
            raise Exception(f"Deck already created from {self.deck_type}")
        else:
            cards = []
      
            words = self.__get_words_from_db(count, is_custom)
            # print(f"words: {words}")
            
            for word in words:
                #¤print(f"word: {word}")
                # print("here is working")
                # print(word.audio.filename)
                # with open(word.audio.filename, "rb") as f:
                #     encoded = base64.b64encode(f.read()).decode('utf-8')
                encoded = ""
                if is_custom:
                    encoded = base64.b64encode(word.audio.filename)
                new_word = Word(word.word, word.language, encoded)
                
                #print(f"id: {word.id}")
                print(word.wordinfo.difficulty())
                new_card = Card(word.id, new_word, [], word.wordinfo.difficulty())
                #¤ new_word = Word(word.word, word.language)
                
                for trans in word.translations:
                    print(f"check tran: {word.translations}")
                    if trans.language != self.target_language:
                        print(f"language wanted is {trans.language} and we want {self.target_language} ")
                        break
                    new_card.addTranslation(trans)
                    #new_trans = Word(trans, trans.language)
                    # new_card = Card(new_word, new_trans)
                if new_card.hasTranslations():
                    cards.append(new_card)
                    count -= 1
                    if count <= 0:
                        break
            self.deck = cards
            # print("made it past")
    
    # def build_deck_from_duo(self):
    #     if len(self.deck) != 0:
    #         raise Exception(f"Deck already created from {self.deck_type}")
    #     else:
    #         print("called")
    #         #self.db.create_tables()
    #         vocab = self.__get_vocab(self.source_language)
    #         print("got vocab")
    #         # self.target_vocab = self._get_vocab(self.target_language)
    #         self.deck = self.__create_card_deck(vocab)
    #         self.deck_type = "Duo"
    
    def build_deck_from_user_input(self, words_to_add):
        pass    
    
    
    def __run_thread(self, q, cards, target_language_vocab):
        while True:
            word = q.get()
            # logger.info(f"getting:{word}")
            # logger.critical(f"__run_thread_vocab:{target_language_vocab[0]}")
            # print(f"__run_thread: {target_language_vocab}")
            self.create_card_for_word(word, cards, target_language_vocab)
            # logger.info(f"got:{word}")
            q.task_done()
            
    def __spawn_threads(self, words):
        num_threads = 2
        q = queue.Queue(len(words))
        cards = []
        
        print(f"self.target_language: {self.target_language}")
        target_language_vocab = self.__get_vocab(self.target_language)
        logger.critical(f"before thread target vocab:{target_language_vocab}")
        
        for i in range(num_threads):
            logger.critical(f"launching thread")
            thread = threading.Thread(target=self.__run_thread, args=[q, cards, target_language_vocab,])
            # logger.critical(f"thread target vocab:{target_language_vocab}")
            thread.start()
        for word in words:
            #logger.info(f"putting{word}")
            q.put(word)
        q.join()
        logger.info("finished putting")
        return cards
    
    

    
    
    def __create_card_deck(self, source_words: List[str]) -> List[Card]:
        cards = []
        # cards.append(self.create_card_for_word("tämä"))
        # cards.append(self.create_card_for_word("tyttö"))
        # cards.append(self.create_card_for_word("sinä"))
        # print(f"cards: {cards}")
        #print(f"one word is: {source_words[1]}")
        cards = self.__spawn_threads(source_words)
        # print(f"cards: {cards}")
        return cards
        
        # for word in source_words:
        #     print(f"adding: {word}")
        #     cards.append(self.create_card_for_word(word))
        # return cards
    
    def __get_translations(self, word: str) -> List[str]:
        translations: List[str] = []
        # get int representing langauge on webxicon
        l1 = languages[self.source_language]
        l2 = languages[self.target_language]
        # logger.critical(f"l2: {self.target_language}")
        if self.target_language in duo_only_languages:
           
            eng_to_l2 = []
            source_to_english = self.lingo.get_translations([word], source=self.source_language, target="en")
            logger.critical(f"get_eng_translations of: {word} to {source_to_english}")
            for translation in source_to_english[word]:
                trans = self.lingo.get_translations([translation], source="en", target=self.target_language)
                eng_to_l2 += trans[translation]
            if len(eng_to_l2) > 0:
                logger.critical(f"__get_translations of: {word} to {eng_to_l2}")
            return eng_to_l2
          
                    
        # scrape all translations of word from webxicon
        url = f"http://webxicon.org/search.php?q={word}&l={l1}&l2={l2}"
        req = requests.get(url, allow_redirects=True).text
        soup = BeautifulSoup(req, 'html.parser')
        for row in soup.find_all('tr'):
            for translation in row.find_all('a'):
                if translation.string != None:
                    translations.append(translation.string)    
        return translations     
    
    def __get_matched_translations(self, translations: List[str], target_language_vocab) -> List[Word]:
        # target_language_vocab = self.__get_vocab(self.target_language)
        translated_words: List[Word] = []
        # print(f"target_language_vocab: {target_language_vocab}")
        # logger.critical(f"__get_matched_translations:{target_language_vocab}")
        for word in target_language_vocab: # Think I need to look up each tranlsation and its target language translation
            # print(f"target_language_word: {word}")
            temp = []
            
            for translation in translations:
                if translation == word and translation not in temp:
                    translated_word = Word(translation, self.target_language)
                    translated_words.append(translated_word)
                    temp.append(translation)
        
        return translated_words
    
    def __get_vocab(self, language):
        print("calling __get_vocab")
        lingo  = self.__duo_login()

        # languageAbreviation = language_by_string[language]
        vocab = lingo.get_vocabulary(language)
        # print(vocab)
      
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
    
    def create_card_for_word(self, source_word, cards, target_language_vocab) -> Card: 
        # logger.critical(f"create_card_for_word:{target_language_vocab}")
        source = Word(source_word, self.source_language)
        # print(f"Translating: {source_word}")
        translations: List[str] = self.__get_translations(source_word)
        # print(f"before_matched: {source.word}: {translations}")
        matched_translations: List[Word] = self.__get_matched_translations(translations, target_language_vocab)
        

            
        card = Card(None, source, [])
        for trans in matched_translations:
            # print(f"matched: {source.word}: {trans.word}")
            card.translations.append(trans)
        cards.append(card)
        #return card
    
    
    


