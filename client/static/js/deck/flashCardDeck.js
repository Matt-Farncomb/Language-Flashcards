class FlashCardDeck extends BaseDeck {

   
    #drawPile;

    constructor() {
        super();
        this.#drawPile = this.cards;
    }

    cardsRemaining() {
        return this.#drawPile.length;
    }

    cardCount() {
        return this.cards.length;
    }

    drawCard(index) {
        try {
            const nextCard = this.#drawPile[index];
            this.#drawPile = this.#drawPile.filter(card => card.word.word != nextCard.word.word);
            return nextCard;
        } catch (error) {
            console.error(`DrawPile is only ${this.#drawPile.length} which is shorter than the index of ${index}`);
        }
    }

    randomCard() {
        const length = this.#drawPile.length;
        if (length < 1) {
            this.shuffleMistakes();
            return this.randomCard();
        }
        else {
            const index = getRandomInt(0, length);
            return this.drawCard(index);
        }
    }

    // Only redraw cards answered incorrectly
    shuffleMistakes() {
        this.#drawPile = this.cards.filter(card => !card.answeredCorrectly);
    }

    shuffle() {
        this.#drawPile = this.cards;
    }

    score() {    
 
        return this.cards.reduce(
            (total, card) => (
                card.answeredCorrectly() ? total+1 : total), 
            0)
    }

    getDeck(server, count) {
        
        server.fetchDeck(count).then((data) => {
            this._cards = data.map((card) => {
                const translation_list = card.translations.map((translation) => {
                    return new Word(translation.__data__.id, translation.__data__.word, translation.__data__.language);
                })
                return new FlashCard(card.id, card.source_word, translation_list);
            }); 
        })
        console.log(this._cards);
    }
}

