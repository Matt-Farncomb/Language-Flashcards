class FlashCard extends BaseCard {

    #id;
    #answeredCorrectly;
    #incorrectCount;

    constructor(id, word, translations) {
        super(word, translations)
        this.#id = id;
        this.#incorrectCount = 0;
    }

    get id() {
        return this.#id;
    }

    get incorrectCount() {
        return this.#incorrectCount;
    }

    get answeredCorrectly() {
        return this.#answeredCorrectly;
    }

    isCorrectTranslation(userInput) {
        this.#answeredCorrectly =  !(this.translations.every(translation => translation.word !== userInput)); 
        if (!this.#answeredCorrectly) {
            this.#incorrectCount++;
        }
        return this.#answeredCorrectly;
    }
   
}