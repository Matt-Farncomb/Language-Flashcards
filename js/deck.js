class Deck {
    constructor(source_language, target_language) {
        this.source_language = source_language;
        this.target_language = target_language;
        this.cards = []
    }

    #addCard(card) {
        this.cards.push(card);
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

