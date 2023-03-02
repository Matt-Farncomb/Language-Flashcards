class Deck {

    private _deck: PlayingCard[] = [];

    get loaded(): boolean {
        return this.deck.length > 0;
    }

    get deck(): PlayingCard[] {
        return this._deck;
    }

    public load(): void {
        const storedDeck = StoredDeck.get();
       
        if (storedDeck) {
            console.log("loaded")
            this._deck = storedDeck;
        }
    }

    public clear(): void {
        this._deck = [];
    }
   
    public drawCard(): PlayingCard | undefined {
        if (this.deck) {
            const top = this.deck.shift() as PlayingCard;
            this.deck.push(top);
            return top;
        }
    }

    public replaceCard(newCard: PlayingCard) {
        this._deck = this.deck.slice(0, -1);
        this.deck.push(newCard);
    }




}