class Server {

    #serverURL;
    #languages;
    // #user;

    constructor(serverURL) {
        this.#serverURL = serverURL
        this.#languages = this.#getLanguages();
        // this.#user = localStorage.getItem('name');
    }

//     localStorage.setItem('name','Chris');
// let myName = localStorage.getItem('name');
// myName

    get languages() {
        return this.#languages;
    }

    async #getLanguages() {
        const url = `${SERVER_URL}languages/`;
        return fetch(url).then((response) => response.json());
    }

    

    #cardsURL(size) {
        const url = `${SERVER_URL}cards/?`+
            `&source_language=${localStorage.getItem('source_language')}`+
            `&target_language=${localStorage.getItem('target_language')}&count=${size}`;
        return url;
    }

    #refreshURL() {
        const url = `${this.#serverURL}?`+
            `&source_language=${localStorage.getItem('source_language')}`+
            `&target_language=${localStorage.getItem('target_language')}`;
        return url;
    }

    // refreshServer() {
    //     fetch(this.#refreshURL(), {
    //         method: 'POST', // or 'PUT'
    //         })
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error('Network response was not OK');
    //             }
    //             return response.blob();
    //         })
    //         .catch((error) => {
    //             console.error('Error:', error);
    //         });
    // }
// return fetch(url).then((response) => response.json());

    fetchDeck(count) {
        const url = this.#cardsURL(count);
        console.log(url);
        return fetch(url).then((response) => response.json());
    }

    uploadDeck(baseDeck) {
        const url = `${this.#serverURL}upload/`
        let cardsArr = [];
        console.log(baseDeck)
        baseDeck.cards.forEach(card => {
            console.log(card)
            cardsArr.push({
                "source_word":card.word,
                "translation":card.translations
            })
        });

        const data = {
            "source_language":baseDeck.sourceLanguage,
            "target_language":baseDeck.targetLanguage,
            "cards":cardsArr 
        }
        console.log(data);
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((response) => console.log(response));
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
        const url = `${this.#serverURL}refresh/`
        
        const data = {
                "source_language": localStorage.getItem('source_language'),
                "target_language": localStorage.getItem('target_language')
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