class Word {

    #word;
    #language;
    #audio;

    constructor(id, word, language) {
        this.#word = word;
        this.#language = language;
        this.#audio = "";
    }

    get word() {
        return this.#word;
    }

    get language() {
        return this.#language;
    }

    get audio() {
        return this.#audio;
    }

    playAudio() {
        throw new error("Not yet implemented");
    }
}