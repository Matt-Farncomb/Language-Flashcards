class Deck {
    constructor(source_language, target_language) {
        this.source_language = source_language;
        this.target_language = target_language;
        this.cards = [];
        this.currentCard = cards[0]; // maybe make it random
    }

    #addCard(card) {
        this.cards.push(card);
    }

    randomCard() {
        const index = getRandomInt(0, this.cards.length);
        return this.cards[index];
    }

    drawPile() {
        return this.cards.map((card) => {
            if (!card.discarded) {
              return card;
            }
        });
    }

    discardPile() {
        return this.cards.map((card) => {
            if (card.discarded) {
              return card;
            }
        });
    }

    getDeck(server, count) {
        server.fetchDeck(count, this.source_language, this.target_language).then((data) => {
            data.forEach(element => {
                const newCard = new Card(element.source_word, element.translations)
                this.#addCard(newCard)
            });
        })

    }
}

