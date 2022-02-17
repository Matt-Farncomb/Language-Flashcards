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
        console.log(url)
        return fetch(url).then((response) => response.json());
    }
}