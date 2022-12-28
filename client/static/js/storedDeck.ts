class StoredDeck {

    static setItem(value: string) {
        localStorage.setItem("deck", value);
        window.dispatchEvent(deckUpdated);
    }

    static clear() {
        localStorage.clear();
        window.dispatchEvent(deckCleared);
    }

    static get(): PlayingCard[] | undefined {

        const json: string | null = localStorage.getItem("deck");

        if (json && json != "{}") {

            const localDeck: Record<string, any>[] = JSON.parse(json);
            console.log(localDeck)
            return localDeck.map(element => new PlayingCard(
                element["id"],
                element["source_word"]["word"],
                element["translations"],
                element["source_word"]["language"],
                element["translations"][0]["__data__"]["language"],
                element["source_word"]["voice"],
                ) );       
        }
    }
}