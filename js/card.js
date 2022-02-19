class Card {

    #word;
    #translations;
    #answeredCorrectly;
    #incorrectCount;

    constructor(word, translations) {
        this.#word = word;
        this.#translations = translations;
        this.#incorrectCount = 0;
    }

    get word() {
        return this.#word;
    } 

    get translations() {
        return this.#translations
    }

    isCorrectTranslation(userInput) {
        this.#answeredCorrectly =  !(this.#translations.every(translation => translation.word !== userInput)); 
        if (!this.#answeredCorrectly) {
            this.#incorrectCount++;
        }
        return this.#answeredCorrectly;
    }

    get answeredCorrectly() {
        return this.#answeredCorrectly;
    }
   
}