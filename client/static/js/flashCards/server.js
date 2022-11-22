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

    

    #cardsURL(size, is_custom) {
        const url = `${SERVER_URL}cards/?`+
            `&source_language=${localStorage.getItem('source_language')}`+
            `&target_language=${localStorage.getItem('target_language')}&count=${size}&is_custom=${is_custom}`;
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

    fetchDeck(count, isCustomDeck) {
        const url = this.#cardsURL(count, isCustomDeck);
        console.log(url);
        return fetch(url).then((response) => response.json());
    }

    async uploadDeck(baseDeck) {
        console.log("uploading");
        const url = `${this.#serverURL}uploadTest/`

        const formData = new FormData();
        
        baseDeck.cards.forEach(card => {
            let testList = [];
            // card.translations.forEach(e => testList.push(e) )
            
            // formData.append("source_language", baseDeck.sourceLanguage)
            // formData.append("target_language", baseDeck.targetLanguage)
            console.log(card.translations);
            formData.append("source_word", card.word)
            formData.append("translation", card.translations);
            // file and filename
            console.log(card.audio);
            formData.append("file", card.audio, card.word);
        });
        console.log(baseDeck.sourceLanguage);
        console.log(baseDeck.targetLanguage);

        formData.append("source_language", [baseDeck.sourceLanguage])
        formData.append("target_language", [baseDeck.targetLanguage])
       
        fetch(url, {method: 'POST', body: formData});

    }

    submitResult(card, is_correct) {
        console.log(card);
        const url = `${this.#serverURL}results/`
        
        const data =
            {
                "id": parseInt(card.id),
                "is_correct": is_correct
            };


        console.log(data);

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((response) => console.log(response));
    }

    updateAudio(id, audio) {
        console.log("uploading");
        const url = `${this.#serverURL}updateAudio/`
        const formData = new FormData();
       
        console.log(audio)
        console.log(parseInt(id))

        formData.append("id", parseInt(id))
        formData.append("audio", audio)

        fetch(url, {method: "POST", body: formData});
    }

    updateCard(card, id, audioWasUpdated=true) {
        if (audioWasUpdated) this.updateAudio(id, card.audio);
        console.log("Updating");
        const url = `${this.#serverURL}update/`
        console.log(card);
        const data = {
            "id": parseInt(id),
            "source_word":card.word,
            "translations":card.translations,
            "audio":card.audio
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

    old_submitResult(deck) {
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