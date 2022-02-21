class Deck {

    // #source_language;
    // #target_language;
    #cards;
    #drawPile;

    constructor() {
        // this.#source_language = localStorage.getItem('source_language');
        // this.#target_language = localStorage.getItem('target_language');
        this.#cards = [];
        this.#drawPile = this.#cards;
        //this.#hand = [];
        // this.drawPi = this.drawPile();
    }

    #addCard(card) {
        this.#cards.push(card);
    }

    cardsRemaining() {
        return this.#drawPile.length;
    }

    // get source_language() {
    //     return this.#source_language;
    // }

    // get target_language() {
    //     return this.#target_language;
    // }

    get cards() {
        return this.#cards;
    }

    // drawCard(index) {
    //     const card = drawPile[index];
    //     card.inHand = true;
    //     return card;
    // }

    // testing

    drawCard(index) {
        try {
            const nextCard = this.#drawPile[index];
            this.#drawPile = this.#drawPile.filter(card => card.word.word != nextCard.word.word);
            //this.#hand = this.#hand.concat(nextCard);
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
            // console.log(this.#drawPile);
            const index = getRandomInt(0, length);
            return this.drawCard(index);
            // const nextCard = this.#drawPile[index];
            // this.#drawPile = this.#drawPile.filter(card => card.word.word != nextCard.word.word);
            // return nextCard;
        }
    }

    // Only redraw cards answered incorrectly
    shuffleMistakes() {
        this.#drawPile = this.#cards.filter(card => !card.answeredCorrectly);
    }

    shuffle() {
        this.#drawPile = this.#cards;
    }

    score() {    
        // let val = 0;
        // this.#cards.forEach(card => {
        //     if (card.answeredCorrectly()) {
        //         val += 1;
        //     }
        // });
        return this.#cards.reduce(
            (total, card) => (
                card.answeredCorrectly() ? total+1 : total), 
            0)
    }

    // randomCard() {
        
    //     const drawPile = this.drawPile();
    //     const length = drawPile.length;
    //     if (length < 1) {
    //         this.shuffle();
    //         return this.randomCard();
    //     }
    //     else {
    //         const index = getRandomInt(0, length);
    //         console.log(drawPile);
    //         const nextCard = drawPile[index];
    //         console.log(nextCard)
    //         nextCard.inHand = true;
    //         return nextCard;
    //     }
    // }

    // shuffle() {
    //     this.#cards.forEach((card) => {
    //         card.inHand = false;
    //         card.discarded = false;
    //     }); 
    // }

    // drawPile() {
    //     return this.#cards.filter((card) => {
    //         if (!card.discarded && !card.inHand) {
    //           return card;
    //         }
    //     });
    // }

    // discardPile() {
    //     return this.#cards.filter((card) => {
    //         if (card.discarded) {
    //           return card;
    //         }
    //     });
    // }

    getDeck(server, count) {
        // server.fetchDeck(count, this.#source_language, this.#target_language).then((data) => {
        server.fetchDeck(count).then((data) => {
            this.#cards = data.map((card) => {
                const translation_list = card.translations.map((translation) => {
                    return new Word(translation.__data__.id, translation.__data__.word, translation.__data__.language);
                })
                return new Card(card.id, card.source_word, translation_list);
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

