class LocalDeck {

    static setItem(value: string) {
        localStorage.setItem("deck", value);
        window.dispatchEvent(new Event("deckUpdated"));
    }

    static clear() {
        localStorage.clear();
        window.dispatchEvent(new Event("deckUpdated"));
    }

    static get(): PlayingCard[] | undefined {

        const json: string | null = localStorage.getItem("deck");

        if (json && json != "{}") {

            const localDeck: Record<string, any>[] = JSON.parse(json);

            return localDeck.map(element => new PlayingCard(
                element["id"],
                element["source_word"],
                element["translations"],
                element["source_language"],
                element["target_language"],
                element["audio"],
                ) );       
        }
    }
}