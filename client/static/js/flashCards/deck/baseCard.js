class BaseCard {

    #word;
    #translations;
    #audio;
    #difficulty;
    _server;

    constructor(word, translations, audio, difficulty) {
        this.#word = word;
        this.#translations = translations;
        this.#audio = audio;
        this.#difficulty = difficulty;
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
    
    get difficulty() {
        return this.#difficulty;
    }

    // saveAudio(blobAudio) {
    //     this.#audio = blobAudio;
    // }
}