class BaseDeck {

    #sourceLanguage;
    #targetLanguage;
    _cards;

    constructor(sourceLanguage, targetLanguage) {
        this.#sourceLanguage = sourceLanguage;
        this.#targetLanguage = targetLanguage;
        this._cards = [];
    }

    get cards() {
        console.log("called");
        return this._cards;
    }

    get sourceLanguage() {
        return this.#sourceLanguage;
    }

    get targetLanguage() {
        return this.#targetLanguage;
    }

    addCard(card){
        this._cards.push(card);
    }

    hasCard(card) {
        for (let baseCard in this._cards) {
            if (card == baseCard.word) {
                return true;
            }
        }
        return false;
    }


}