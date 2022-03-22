class Card {

    #id;
    #word;
    #translations;
    #answeredCorrectly;
    #incorrectCount;

    constructor(id, word, translations) {
        this.#id = id;
        this.#word = word;
        this.#translations = translations;
        this.#incorrectCount = 0;
    }

    get id() {
        return this.#id;
    }

    get word() {
        return this.#word;
    } 

    get translations() {
        return this.#translations;
    }

    get incorrectCount() {
        return this.#incorrectCount;
    }

    isCorrectTranslation(userInput) {
        this.#answeredCorrectly =  !(this.#translations.every(translation => translation.word !== userInput)); 
        console.log(this.#incorrectCount);
        if (!this.#answeredCorrectly) {
            this.#incorrectCount++;
        }
        return this.#answeredCorrectly;
    }

    get answeredCorrectly() {
        return this.#answeredCorrectly;
    }
   
}