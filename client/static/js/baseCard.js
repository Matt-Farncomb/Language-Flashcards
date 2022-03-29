class BaseCard {

    #source_word;
    #translation;

    constructor(word, translations) {
        this.#source_word = word;
        this.#translation = translations;
    }

    get source_word() {
        return this.#source_word;
    }

    get translation() {
        return this.#translation;
    }
}