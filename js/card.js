class Card {

    #word;
    #translations;

    constructor(word, translations) {
        this.#word = word;
        this.#translations = translations;
    }

    get word() {
        return this.#word;
    } 

    get translations() {
        return this.#translations
    }

    isCorrectTranslation(userInput) {
        return this.#translations.includes(userInput);
    }
   
}