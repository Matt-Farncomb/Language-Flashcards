class DrawDeck {

    #server;

    constructor(server) { 
        this.#server = server;  
    }

    get totalCards() {
        return document.querySelector("#deck-size").value;
    }

    get sourceLanguage() {
        return document.querySelector("#source-language").value;
    }

    get targetLanguage() {
        return document.querySelector("#translation-language").value;
    }

    get languages() {
        return this.#server.languages;
    }

    totalCardsIsValid() {
        const selector = document.querySelector("#deck-size");
        const validNumberInput = this.totalCards > 0;
        console.log(validNumberInput)
        this.#updateDiplsayIfValid(selector, validNumberInput);
        return this.totalCards > 0;
    }

    async isThisLanguageValid(selectorString) {
        const selector = document.querySelector(`#${selectorString}-language`);
        const available = await this.isAvailableLanguage(selector.value);
        const noDuplicate = this.sourceLanguage !== this.targetLanguage;
        this.#updateDiplsayIfValid(selector, noDuplicate && available)
        return noDuplicate && available;
    }

    async #updateDiplsayIfValid(selector, isValid) {
        const validAndWaited = await isValid;
        if (validAndWaited) {
            selector.classList.add("is-primary");
            selector.classList.remove("is-danger");
        } else if (!validAndWaited && selector.value != "") {
            selector.classList.remove("is-primary");
            selector.classList.add("is-danger");
        } else if (selector.value == "") {
            selector.classList.remove("is-primary");
            selector.classList.add("is-danger");
        }
    }

    async isAvailableLanguage(userInputLanguage) { 
        const data = await this.languages;
        return data.includes(userInputLanguage);        
    }

    async readyToDraw() {
        const noDuplicates = this.sourceLanguage !== this.targetLanguage;
        const languagesAreValid = await this.isThisLanguageValid("source") && await this.isThisLanguageValid("translation");
        const totalIsValid = this.totalCardsIsValid();
        return noDuplicates && languagesAreValid && totalIsValid;        
    }



}