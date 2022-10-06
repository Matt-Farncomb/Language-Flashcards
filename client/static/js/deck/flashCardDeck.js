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
            if (length == 1) document.querySelector("#new-card").innerText = "Shuffle";
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

    async getDeck(server, count, isDuoDeck) {
        
        server.fetchDeck(count, isDuoDeck).then((data) => {
            this._cards = data.map((card) => {
                const translation_list = card.translations.map((translation) => {
                    return new Word(translation.__data__.word, translation.__data__.language);
                })

                let response = card.source_word.voice
                // let voice;
                
                let voice = fetch(`data:audio/ogg;base64,${response}`)
                .then((response) => response.blob()) 
                .then((response) => {
                    return window.URL.createObjectURL(response);
                });
                const word =  new Word(card.source_word.word, card.source_word.language)
                const thing = new FlashCard(card.id, word, translation_list, voice)
                console.log(word)
                console.log(thing)
                return thing;
            }); 
        })

    }
}

