class BaseCard {

    #word;
    #translations;
    #audio;
    _server;

    constructor(word, translations, audio) {
        this.#word = word;
        this.#translations = translations;
        this.#audio = audio;
    }

    get word() {
        return this.#word;
    }

    get translations() {
        return this.#translations;
    }

    get audio() {
        return this.#audio;
    }

    // saveAudio(blobAudio) {
    //     this.#audio = blobAudio;
    // }
}