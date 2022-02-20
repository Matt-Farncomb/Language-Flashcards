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
        
        const data = deck.cards.map( (card)  => (
            {
                "id": parseInt(card.id),
                "wrong_count": parseInt(card.incorrectCount)
            }
        )
        );

        console.log(data)

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((response) => console.log(response));
    }

    refresh() {
        console.log();
        const url = `${this.#serverURL}refresh/`
        
        const data = {
                "source_language": "fi",
                "target_language": "es"
            };

        console.log(data)

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((response) => console.log(response));
    }
}