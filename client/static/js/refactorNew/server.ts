class Serverr {

    static baseURL ="this.baseURL";


    // post edited card to server
    static async postEdit(card: UploadCard) {
        const editUrl = new URL(this.baseURL);
        editUrl.pathname = "upload_deck";

        const formData = new FormData();
        formData.append("source_word", card.sourceWord)
        formData.append("translations", JSON.stringify(card.translations));
        formData.append("file", card.audio, card.sourceWord); // file and filename

        const response = await fetch(editUrl, {method: 'POST', body: formData});
        if (!response.ok) {
            logError(`Could not submit edit: ${response.status}`)
        }
    }


    // post new card deck to server
    static async uploadDeck(deck: UploadCard[]) {
        const uploadURL = new URL(this.baseURL);
        uploadURL.pathname = "upload_deck";

        const formData = new FormData();
        formData.append("source_language", deck[0].sourceLanguage);
        formData.append("target_language", deck[0].targetLanguage);
        deck.forEach(card => {
            formData.append("source_word", card.sourceWord);
            formData.append("translations", JSON.stringify(card.translations));
            formData.append("audio", card.audio);
        })

        const response = await fetch(uploadURL, { method: 'POST', body: formData })
        if (!response.ok) {
            logError(`Could not upload deck: ${response.status}`);
        }
    }

    static async getDeck(count: number, sourceLanguage: string, targetLanguage: string) {
        const editURL = new URL(this.baseURL);
        editURL.pathname = "get_deck";
        editURL.searchParams.append("count", count.toString());
        editURL.searchParams.append("source_language", sourceLanguage);
        editURL.searchParams.append("target_language", targetLanguage);

        const response = await fetch(editURL);
        if (!response.ok) {
            logError(`Could not draw deck: ${response.status}`); 
        }
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

    
}