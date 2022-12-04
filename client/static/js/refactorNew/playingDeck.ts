class PlayingDeck {

    deck: PlayingCard[];
    #topCard: PlayingCard;

    constructor() {

        const newDeck: PlayingCard[] | undefined = this.#getDeck();

        if (newDeck) {
            this.deck = newDeck;
        } else {
            // The user has never made any cards
            // So handle this with a message prompt of some kind
        }
         
        
    }

    get topCard() {
        return this.#topCard;
    }


    next() {

    }

    shuffle() {

    }

    #getDeck(): PlayingCard[] | undefined {  
        const json: string | null = localStorage.getItem("deck");
        if (json) {
            const localDeck: string[] = JSON.parse(json);
            return localDeck.map(element => new PlayingCard(element) );      
        }
    }

    
}

