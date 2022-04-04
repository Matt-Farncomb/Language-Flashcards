class CustomCard {

    #availableLanguages; 

    constructor(languages) {
        this.#availableLanguages = languages;
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

    #validateWord(...args) {
        
        // throw new Error('Method not implemented.');
        return true;
    }

    async #validateLanguage(userInputLanguage) { 
        const data = await this.#availableLanguages;
        return data.includes(userInputLanguage);        
    }

    async #validInput(selector, inputValidatorFunc) {
        const isValid = await inputValidatorFunc;
        
        if (isValid) {
            selector.classList.add("is-primary");
            selector.classList.remove("is-danger");
        } else {
            selector.classList.remove("is-primary");
            selector.classList.add("is-danger");
        }
        return isValid;
    }

    #sourceIsValid(deck) {
        const selector = document.querySelector("#add-source");
        if (deck.hasCard(this.word)) {
            return false;
        }
        const isValidInput = this.#validateWord(this.word);
        return this.#validInput(selector, isValidInput);
    }

    #translationIsValid() {
        const selector = document.querySelector("#add-translation");
        const isValidInput = this.#validateWord(this.translation);
        return this.#validInput(selector, isValidInput);
    }

    #sourceLanguageIsValid() {
        const selector = document.querySelector("#add-source-language");
        const isValidInput = this.#validateLanguage(this.sourceLanguage);
        return this.#validInput(selector, isValidInput);
    }

    #translationLanguageIsValid() {
        const selector = document.querySelector("#add-translation-language");
        const isValidInput = this.#validateLanguage(this.targetLanguage);
        return this.#validInput(selector, isValidInput);
    }

    readyToUpload(deck) {
        return (this.#sourceLanguageIsValid() && this.#translationLanguageIsValid() &&
            this.#sourceIsValid(deck) && this.#translationIsValid());
    }

    languageIsReady(selector) {
        const lang = selector.value;
        return this.#validInput(selector, this.#validateLanguage(lang, this.#availableLanguages));
    }



}