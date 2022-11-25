class Card {

    #id;
    #sourceLanguage;
    #targetLanguage;
    #sourceWord;
    #translations;
    #audio;
    #incorrectCount;
    #correctCount;
    #difficulty;
 
    constructor(modalId, sourceWord, translations, sourceLanguage, targetLanguage, audio, incorrectCount, correctCount, difficulty) {
        this.#modalId = modalId;
        this.#sourceWord = sourceWord;
        this.#translations = translations;
        this.#sourceLanguage = sourceLanguage;
        this.#targetLanguage = targetLanguage;  
        this.#audio = audio;
        this.#incorrectCount = incorrectCount;
        this.#correctCount = correctCount;
        this.#difficulty = difficulty;
    }

    get id() {
        return this.#id;
    }

    get sourceLanguage() {
        return this.#sourceLanguage;
    }

    get targetLanguage() {
        return this.#targetLanguage;
    }

    get sourceWord() {
        return this.#sourceLanguage;
    }

    get translations() {
        return this.#targetLanguage;
    }

    get audio() {
        return this.#audio;
    }

    get incorrectCount() {
        return this.#incorrectCount;
    }

    get correctCount() {
        return this.#correctCount;
    }

    get difficulty() {
        return this.#difficulty;
    }

    set audio(audioClip) {
        this.#audio = audioClip;
    }

}