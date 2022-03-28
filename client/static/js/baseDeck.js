class BaseDeck {

    #sourceLanguage;
    #targetLanguage;
    #cards;

    constructor(sourceLanguage, targetLanguage) {
        this.#sourceLanguage = sourceLanguage;
        this.#targetLanguage = targetLanguage;
        this.#cards = [];
    }

    addCard(card){
        this.#cards.push(card);
    }
}