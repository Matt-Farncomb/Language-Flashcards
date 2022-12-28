class Deck {

    private deck: PlayingCard[] = [];

    get loaded(): boolean {
        return this.deck.length > 0;
    }

    load(): void {
        const storedDeck = StoredDeck.get();
        if (storedDeck) {
            this.deck = storedDeck;
        }
    }

    clear(): void {
        this.deck = [];
    }
   
    drawCard(): PlayingCard | undefined {
        if (this.deck) {
            const top = this.deck.shift() as PlayingCard;
            this.deck.push(top);
            return top;
        }
    }


}