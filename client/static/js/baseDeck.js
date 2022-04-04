class BaseDeck {

    #sourceLanguage;
    #targetLanguage;
    _cards;

    constructor(sourceLanguage, targetLanguage) {
        this.#sourceLanguage = sourceLanguage;
        this.#targetLanguage = targetLanguage;
        this._cards = [];
    }

    addCard(card){
        this._cards.push(card);
    }

    hasCard(card) {
        for (baseCard in this._cards) {
            if (card == baseCard.word) {
                return true;
            }
        }
        return false;
    }

    get cards() {
        return this._cards;
    }

    get sourceLanguage() {
        return this.#sourceLanguage;
    }

    get targetLanguage() {
        return this.#targetLanguage;
    }
}