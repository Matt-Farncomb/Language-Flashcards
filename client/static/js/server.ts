class Server {

    static baseURL ="http://127.0.0.1:8000/";

    static validLangauges: Promise<string[]> = this.getValidLanguages();

    static fetchedDeckLength: string;

    // post edited card to server
    static async postEdit(card: EditedCard, deckSize: number) {
    // static async postEdit(card: BaseCard) {
        const editUrl = new URL(this.baseURL);
        editUrl.pathname = "edit";

        const sl = card.sourceLanguage;
        const tl = card.targetLanguage;
        const formData = new FormData();

        if (card.sourceWord) {
            formData.append("id", card.id);
            formData.append("source_word", card.sourceWord);
            formData.append("translations", JSON.stringify(card.translations));
    
            if (card.audio) {
                formData.append("file", card.audio, `blob_${card.id}_${card.sourceWord}`);
            }

            const response = await fetch(editUrl, {method: 'POST', body: formData});
            
            if (!response.ok) {
                logError(`Could not submit edit: ${response.status}`)
            } else {
                logInfo("Success!");
                if (sl && tl) {
                    Server.getDeck(JSON.stringify(deckSize), sl, tl);
                }
            }
        }
       
    }

    // post new card deck to server
    static async uploadDeck(deck: BaseCard[]) {
        
        const uploadURL = new URL(this.baseURL);
        uploadURL.pathname = "upload_deck";
        const formData = new FormData();
        formData.append("source_language", deck[0].sourceLanguage);
        formData.append("target_language", deck[0].targetLanguage);
        deck.forEach(card => {
            formData.append("source_word", card.sourceWord);
            formData.append("translations", JSON.stringify(card.translations.map(translation => translation.word)));
            if (card.audio) {
                formData.append("file", card.audio);
            }
        })

        const response = await fetch(uploadURL, { method: 'POST', body: formData })
        if (!response.ok) {
            logError(`Could not upload deck: ${response.status}`);
        } else {
            logInfo(response.statusText);
        }
    }

    static async getDeck(count: string, sourceLanguage: string, targetLanguage: string): Promise<Response> {
        console.log("getting")
        const editURL = new URL(this.baseURL);
        editURL.pathname = "get_deck";
        editURL.searchParams.append("count", count);
        editURL.searchParams.append("source_language", sourceLanguage);
        editURL.searchParams.append("target_language", targetLanguage);
        this.fetchedDeckLength = count;

        const response = await fetch(editURL);
        if (!response.ok) {
            logError(`Could not draw deck: ${response.status}`); 
        }
        else {
            const responseText = await response.text();
            StoredDeck.setItem(responseText);
        }
        
        return response;
        
    }

    static async getValidLanguages(): Promise<string[]> {
        const languagesURL = new URL(this.baseURL);
        languagesURL.pathname = "get_languages";

        const response = await fetch(languagesURL);
        if (response.ok) {
            return JSON.parse(await response.json());
        } else {
            logError(`Could not get languages: ${response.status}`);
            return []; 
        }
    }

    // post new score to server and update local score of same card on success to ensure consistency
    static async updateScore(card: PlayingCard, score: number) {
        const updateScoreURL = new URL(this.baseURL);
        updateScoreURL.pathname = "update_score";

        const formData = new FormData();
        formData.append("id", card.id);
        // formData.append("score", (card.correctCount + score).toString());
        
        const response = await fetch(updateScoreURL, { method: "POST", body: formData });
        if (!response.ok) {
            logError(`Could not update score: ${response.status}`); 
        } else {
            // card.updateLocalScore(score);
        }

    }

    // Opens link in new tab to the user can easily go back to continue their game after referencing the table
    static async goToTable(sourceLanguage: string, targetLanguage: string) {
        const tableURL = new URL(this.baseURL);
        tableURL.pathname = "table";
        tableURL.searchParams.append("source_language", sourceLanguage);
        tableURL.searchParams.append("target_language", targetLanguage);
        tableURL.searchParams.append("is_custom", JSON.stringify(true));

        window.open(tableURL.toString());
    }

    static async logIn(username: string, password: string) {
        const logInURL =  new URL(this.baseURL);
        logInURL.pathname = "login";

        // const formData = new FormData();
        // formData.append("username", username);
        // formData.append("password", password);

        const data = {
            "username": username,
            "password": password
        };
        
        const response = await fetch(logInURL, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' }  })
        if (!response.ok) {
            logError(`Could not Log In: ${response.status}`);
        } else {
            logInfo(response.statusText);
        }
    }

    static async signUp(username: string, password: string, firstname: string, lastname: string) {
        const signUpURL =  new URL(this.baseURL);
        signUpURL.pathname = "sign_up";

        console.log("here i am working");
        
        // const formData = new FormData();
        // formData.append("username", username);
        // formData.append("password", password);
        // formData.append("firstname", firstname);
        // formData.append("lastname", lastname);

        const data = {
            "username": username,
            "password": password,
            "firstname": firstname,
            "lastname": lastname
        };
        
        const response = await fetch(signUpURL, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } })
        if (!response.ok) {
            logError(`Could not Sign Up: ${response.status}`);
        } else {
            logInfo(response.statusText);
        }
       
    }

    
}