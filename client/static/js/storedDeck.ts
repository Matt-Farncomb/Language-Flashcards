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
            console.log(json);
            const translationLanguage = localDeck[0].translations[0].__data__.language;
            console.log(localDeck[0])
            console.log(localDeck[0].difficulty)
            return localDeck.map(element => new PlayingCard(
                element.id,
                element.source_word.word,
                element.translations.map((element: any) => {
                    const translation = element.__data__;
                    return new Word(
                        translation["word"],
                        translation["id"],
                        translation["language"],
                        translation["parent"],
                    )
                }),
                element.source_word.language,
                translationLanguage,
                element.source_word.voice,
                element.difficulty,
                ) );       
        }
    }
}