class CustomCard {

    #languages; 
    #server;

    constructor(server) {
        this.#server = server;
    }

    get word() {
        return document.querySelector("#add-source").value;
    }

    get translation() {
        return document.querySelector("#add-translation").value;
    }

    get sourceLanguage() {
        return document.querySelector("#add-source-language").value;
    }

    get targetLanguage() {
        return document.querySelector("#add-translation-language").value;
    }

    get languages() {
        return this.#server.languages;
    }

    #validateIsWord(selector) {
      
        if (selector.validity.patternMismatch || selector.value == "") {
            // selector.setCustomValidity("Please enter words only");
            // selector.reportValidity();
            return false;
        }
        // throw new Error('Method not implemented.');
        return true;
    }

    async isAvailableLanguage(userInputLanguage) { 
        const data = await this.languages;
        return data.includes(userInputLanguage);        
    }

    async #updateDiplsayIfValid(selector, isValid) {
        const waited = await isValid;
        if (waited) {
            selector.classList.add("is-primary");
            selector.classList.remove("is-danger");
        } else if (!waited && selector.value != "") {
            selector.classList.remove("is-primary");
            selector.classList.add("is-danger");
        }
    }

    #sourceIsValid(deck) {
        if (deck.hasCard(this.word)) {
            return false;
        }
        const sourceInput = document.querySelector("#add-source");
        const isWord = this.#validateIsWord(sourceInput);
        this.#updateDiplsayIfValid(sourceInput, isWord);
        return isWord;
    }

    #translationIsValid() {
        const translationInput = document.querySelector("#add-translation");
        const isWord = this.#validateIsWord(translationInput); 
        this.#updateDiplsayIfValid(translationInput, isWord);
        return isWord;
    }

    async isThisLanguageValid(selectorString) {
        const selector = document.querySelector(`#add-${selectorString}-language`);
        const available = await this.isAvailableLanguage(selector.value);
        const noDuplicate = this.sourceLanguage !== this.targetLanguage;
        this.#updateDiplsayIfValid(selector, noDuplicate && available)
        return noDuplicate && available;
    }

    async readyToUpload(deck) {
        const noDuplicates = this.sourceLanguage !== this.targetLanguage;
        const languagesAreValid = await this.isThisLanguageValid("source") && await this.isThisLanguageValid("translation");
        const wordsAreValid = this.#sourceIsValid(deck) && this.#translationIsValid();
        return noDuplicates && languagesAreValid && wordsAreValid;        
    }

    // languageIsReady(selector) {
    //     const lang = selector.value;
    //     const noDuplicate = this.sourceLanguage !== this.targetLanguage;
    //     const isValidInput = this.#validateLanguage(lang);
    //     this.#updateDiplsayIfValid(selector, noDuplicate && isValidInput)
    //     return noDuplicate && isValidInput;
    // }

    wordIsReady(selector) {
        const wordIsValid = this.#validateIsWord(selector);
        this.#updateDiplsayIfValid(selector, wordIsValid);
        return wordIsValid;
    }



}