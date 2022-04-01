class BaseCard {

    #word;
    #translations;
    _server;

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