import duolingo
from decouple import config # type: ignore
from bs4 import BeautifulSoup # type: ignore
import requests 
from typing import List

languages = {
    "es":4,
    "fi":17,
    "en":3,
}

lingo  = duolingo.Duolingo(config('DUO_USER'), config('DUO_PWORD'))


class Word:
    #def __init__(self, word: str, language: str, voice: Voice):
    def __init__(self, word: str, language: str):
        self.word = word
        # self.voice = voice
        # self.audio_url = self.voice.speak(word)
        self.language = language

class Card:
    def __init__(self, source_word: Word, translations :List[Word]):
        self.source_word = source_word
        self.translations = translations  
         
class OldCard:
    def __init__(self, source_word: Word, translation :Word):
        self.source_word = source_word
        self.translation = translation

class Deck:
    def __init__(self, source_language, target_language):
        self.source_language = source_language
        self.target_language = target_language
        # self.vocab = [] # thisbegins empty because user can build deck from requested vocab
        # self.target_vocab = []
        self.deck = []
        self.deck_type = ""
        # self.vocab = self._get_vocab(source_language)
        # self.target_vocab = self._get_vocab(source_language)
        
    def _get_words_from_db(self, count: int):
        return db_helper.get_words(count, self.source_language) # type: ignore
    
    def build_deck_from_db(self, count):
        if len(self.deck) != 0:
            raise Exception(f"Deck already created from {self.deck_type}")
        else:
            cards = []
            print("word")
            words = self._get_words_from_db(count)
            for word in words:
                print(f"word: {word}")
                new_word = Word(word.word, word.language)
                for trans in word.translations:
                    new_trans = Word(trans, trans.language)
                    new_card = Card(new_word, new_trans)
                    cards.append(new_card)
            self.deck = cards
    
    def build_deck_from_duo(self):
        if len(self.deck) != 0:
            raise Exception(f"Deck already created from {self.deck_type}")
        else:
            vocab = self._get_vocab(self.source_language)
            # self.target_vocab = self._get_vocab(self.target_language)
            self.deck = self._create_card_deck(vocab)
            self.deck_type = "Duo"
    
    def build_deck_from_user_input(self, words_to_add):
        pass    
    
    def _create_card_deck(self, source_words: List[str]) -> List[Card]:
        cards = []
        cards.append(self.create_card_for_word("tämä"))
        cards.append(self.create_card_for_word("tyttö"))
        cards.append(self.create_card_for_word("sinä"))
        #print(f"one word is: {source_words[1]}")
        # for word in source_words:
        #     cards += self.create_cards_for_word(word)
        return cards
    
    def _get_translations(self, word: str) -> List[str]:
        translations: List[str] = []
        # get int representing langauge on webxicon
        l1 = languages[self.source_language]
        l2 = languages[self.target_language]
        # scrape all translations of word from webxicon
        url = f"http://webxicon.org/search.php?q={word}&l={l1}&l2={l2}"
        req = requests.get(url, allow_redirects=True).text
        soup = BeautifulSoup(req, 'html.parser')
        for row in soup.find_all('tr'):
            for translation in row.find_all('a'):
                if translation.string != None:
                    translations.append(translation.string)    
        return translations     
    
    def _get_matched_translations(self, translations: List[str]) -> List[Word]:
        target_language_vocab = self._get_vocab(self.target_language)
        translated_words: List[Word] = []
        for word in target_language_vocab:
            temp = []
            for translation in translations:
                if translation == word and translation not in temp:
                    translated_word = Word(translation, self.target_language)
                    translated_words.append(translated_word)
                    temp.append(translation)
        
        return translated_words
    
    def _get_vocab(self, language):
        vocab = lingo.get_vocabulary(language)
        words = [ word["word_string"] for word in vocab["vocab_overview"] ]
        return words
        # for word in words:
        #     card = Card()
    
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
    def create_card_for_word(self, source_word) -> Card: 
        source = Word(source_word, self.source_language)
        translations: List[str] = self._get_translations(source_word)
        matched_translations: List[Word] = self._get_matched_translations(translations)
        print(matched_translations)
        card = Card(source, [])
        for trans in matched_translations:
            card.translations.append(trans)
        return card
    
    
    


