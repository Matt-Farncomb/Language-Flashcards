class Deck {

    #source_language;
    #target_language;
    #cards;
    
    constructor(source_language, target_language) {
        this.#source_language = source_language;
        this.#target_language = target_language;
        this.#cards = [];
        // this.drawPi = this.drawPile();
    }

    #addCard(card) {
        this.#cards.push(card);
    }

    drawCard(index) {
        const card = drawPile[index];
        card.inHand = true;
        return card;
    }

    randomCard() {
        
        const drawPile = this.drawPile();
        const length = drawPile.length;
        if (length < 1) {
            this.shuffle();
            return this.randomCard();
        }
        else {
            const index = getRandomInt(0, length);
            console.log(drawPile);
            const nextCard = drawPile[index];
            console.log(nextCard)
            nextCard.inHand = true;
            return nextCard;
        }
    }

    shuffle() {
        this.#cards.forEach((card) => {
            card.inHand = false;
            card.discarded = false;
        }); 
    }

    drawPile() {
        return this.#cards.filter((card) => {
            if (!card.discarded && !card.inHand) {
              return card;
            }
        });
    }

    discardPile() {
        return this.#cards.filter((card) => {
            if (card.discarded) {
              return card;
            }
        });
    }

    getDeck(server, count) {
        server.fetchDeck(count, this.#source_language, this.#target_language).then((data) => {
            this.#cards = data.map((card) => {
                const translation_list = card.translations.map((translation) => {
                    return new Word(translation.__data__.word, this.#target_language);
                })
                return new Card(card.source_word, translation_list);
            });
            
        })

    }

    // getDeck(server, count) {
    //     server.fetchDeck(count, this.source_language, this.target_language).then((data) => {

    //         this.cards = data.map((card) => {
    //         // data.forEach(card => {
    //             const translation_list = card.translations.map((translation) => {
    //                 return new Word(translation.__data__.word, this.target_language);
    //             })
    //             // let translation_list = [];
    //             // card.translations.forEach(translation => {
    //             //     const translatedWord = new Word(translation.__data__.word, this.target_language);
    //             //     translation_list.push(translatedWord);
    //             // });
    //             return new Card(card.source_word, translation_list);
    //             //this.#addCard(newCard)
    //         });
    //     })

    // }
}

