class Server {

    static baseURL ="http://127.0.0.1:8000/";

    static validLangauges: Promise<string[]> = this.getValidLanguages();

    // post edited card to server
    static async postEdit(card: BaseCard) {
        const editUrl = new URL(this.baseURL);
        editUrl.pathname = "edit_card";

        const formData = new FormData();
        formData.append("source_word", card.sourceWord)
        formData.append("translations", JSON.stringify(card.translations));

        if (card.audio) {
            formData.append("file", card.audio, card.sourceWord); // file and filename        
        }
       
        const response = await fetch(editUrl, {method: 'POST', body: formData});
        if (!response.ok) {
            logError(`Could not submit edit: ${response.status}`)
        }
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


    // post new card deck to server
    static async uploadDeck(deck: BaseCard[]) {
        
        const uploadURL = new URL(this.baseURL);
        uploadURL.pathname = "upload_deck";
        const formData = new FormData();
        formData.append("source_language", deck[0].sourceLanguage);
        formData.append("target_language", deck[0].targetLanguage);
        deck.forEach(card => {
            formData.append("source_word", card.sourceWord);
            formData.append("translation", JSON.stringify(card.translations));
            if (card.audio) {
                formData.append("audio", card.audio);
            }
        })

        const response = await fetch(uploadURL, { method: 'POST', body: formData })
        if (!response.ok) {
            logError(`Could not upload deck: ${response.status}`);
        }
    }

    static async getDeck(count: string, sourceLanguage: string, targetLanguage: string): Promise<Response> {
        const editURL = new URL(this.baseURL);
        editURL.pathname = "get_deck";
        editURL.searchParams.append("count", count);
        editURL.searchParams.append("source_language", sourceLanguage);
        editURL.searchParams.append("target_language", targetLanguage);

        const response = await fetch(editURL);
        if (!response.ok) {
            logError(`Could not draw deck: ${response.status}`); 
        }
        return response.json();
        
    }

    // post new score to server and update local score of same card on success to ensure consistency
    static async updateScore(card: PlayingCard, score: number) {
        const updateScoreURL = new URL(this.baseURL);
        updateScoreURL.pathname = "update_score";

        const formData = new FormData();
        formData.append("id", card.id);
        formData.append("score", (card.correctCount + score).toString());
        
        const response = await fetch(updateScoreURL, { method: "POST", body: formData });
        if (!response.ok) {
            logError(`Could not update score: ${response.status}`); 
        } else {
            card.updateLocalScore(score);
        }

    }

    static async goToTable(sourceLanguage: string, targetLanguage: string) {
        const tableURL = new URL(this.baseURL);
        tableURL.pathname = "table";
        tableURL.searchParams.append("source_language", sourceLanguage);
        tableURL.searchParams.append("target_language", targetLanguage);

        const response = await fetch(tableURL);
        if (!response.ok) {
            logError(`Could not get table: ${response.status}`); 
        }
    }

    
}