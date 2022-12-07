class Word {

    #word;
    #language;

    constructor(word, language) {
        this.#word = word;
        this.#language = language;
    }

    get word() {
        return this.#word;
    }

    get language() {
        return this.#language;
    }


}