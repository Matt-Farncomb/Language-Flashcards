from typing import List
import os 
import duolingo # type: ignore
import requests 
from bs4 import BeautifulSoup # type: ignore
from decouple import config # type: ignore

from voice import Voice

lingo  = duolingo.Duolingo(config('DUO_USER'), config('DUO_PWORD'))

languages = {
    "es":4,
    "fi":17,
    "en":3,
}

class Word:
    #def __init__(self, word: str, language: str, voice: Voice):
    def __init__(self, word: str, language: str):
        self.word = word
        # self.voice = voice
        # self.audio_url = self.voice.speak(word)
        self.language = language
        
class Card:
    def __init__(self, source_word: Word, translation :Word):
        self.source_word = source_word
        self.translation = translation
        
class Deck:
    def __init__(self, source_words: List[str], source_language: str, target_language: str):
        #self.source_words = source_words
        self.source_language = source_language
        self.target_language = target_language
        # self.voices = { "source": Voice(source_language), "target": Voice(target_language) }
        self.cards = self.create_card_deck(source_words)
        
    def create_card_deck(self, source_words: List[str]) -> List[Card]:
        cards = []
        for word in source_words:
            cards += self.create_cards_for_word(word)
        return cards
    
    def get_matched_translations(self, translations: List[str]) -> List[Word]:
        target_language = self.target_language
        target_language_vocab = lingo.get_vocabulary(target_language)
        translated_words: List[Word] = []
        #print(translations)
        for word in target_language_vocab["vocab_overview"]:
            word_str = word["word_string"]
            temp = []
            for translation in translations:
                if translation == word_str and translation not in temp:
                    #translated_word = Word(translation, target_language, self.voices["target"] )
                    translated_word = Word(translation, target_language)
                    translated_words.append(translated_word)
                    
                    temp.append(translation)
        
        return translated_words
    
    def create_cards_for_word(self, source_word) -> List[Card]:
        #source = Word(source_word, self.source_language, self.voices["source"] )
        source = Word(source_word, self.source_language)
        translations: List[str] = self.get_translations(source_word)
        matched_translations: List[Word] = self.get_matched_translations(translations)
        cards = [ Card(source, translation) for translation in matched_translations ]
        return cards 
        
    def get_translations(self, word: str) -> List[str]:
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