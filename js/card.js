class Card {

    #word;
    #translations;
    #discarded;
    #inHand;

    constructor(word, translations) {
        this.#word = word;
        this.#translations = translations;
        this.#discarded = false;
        this.#inHand = false;
    }

    get word() {
        return this.#word;
    } 

    get translations() {
        return this.#translations
    }

    get discarded() {
        return this.#discarded;
    }

    get inHand() {
        return this.#inHand;
    }

    set discarded(value) {
        this.#discarded = value;
    }

    set inHand(value) {
        this.#inHand = value;
    }
}