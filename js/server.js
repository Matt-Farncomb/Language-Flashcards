class Server {

    #serverURL;

    constructor(serverURL) {
        this.#serverURL = serverURL
    }

    #cardsURL(size, source_language, target_language) {
        const url = `${SERVER_URL}?count=${size}`+
            `&source_language=${source_language}`+
            `&target_language=${target_language}`;
        return url;
    }

    #refreshURL(source_language, target_language) {
        const url = `${this.#serverURL}?`+
            `&source_language=${source_language}`+
            `&target_language=${target_language}`;
    }

    // WIP
    refreshServer() {
        fetch(this.#refreshURL("fi", "es"), {
            method: 'POST', // or 'PUT'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not OK');
                }
                return response.blob();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
// return fetch(url).then((response) => response.json());

    fetchDeck(count, source_language, target_language) {
        const url = this.#cardsURL(count, source_language, target_language)
        console.log(url);
        return fetch(url).then((response) => response.json());
    }

    submitResult(deck) {
        console.log(deck);
        const url = `${this.#serverURL}results/`
        
        const data = deck.cards.concat( card => 
            {
                "card_id"; card.id,
                "wrong_count"; card.incorrectCount
            }
        );

        const data2 = {
            "card_id": "2",
            "wrong_count": "3"
        }

        console.log(data2);
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data2)
        })
        .then((response) => response.json())
        .then((response) => console.log(response));
    }
}