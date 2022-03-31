class BaseCard {

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
        return this.#translations;
    }
}