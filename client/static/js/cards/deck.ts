class Deck {

    private _deck: PlayingCard[] = [];

    get loaded(): boolean {
        return this.deck.length > 0;
    }

    get deck(): PlayingCard[] {
        return this._deck;
    }

    load(): void {
        const storedDeck = StoredDeck.get();
       
        if (storedDeck) {
            console.log("loaded")
            this._deck = storedDeck;
        }
    }

    clear(): void {
        this._deck = [];
    }
   
    drawCard(): PlayingCard | undefined {
        if (this.deck) {
            const top = this.deck.shift() as PlayingCard;
            this.deck.push(top);
            return top;
        }
    }

    replaceCard(newCard: PlayingCard) {
        this._deck = this.deck.slice(0, -1);
        this.deck.push(newCard);
    }




}