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

    #validateWord(selector) {
      
        if (selector.validity.patternMismatch) {
            selector.setCustomValidity("I am expecting text!");
            selector.reportValidity();
            return false;
        }
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
        const isValidInput = this.#validateWord(selector);
        return this.#validInput(selector, isValidInput);
    }

    #translationIsValid() {
        const selector = document.querySelector("#add-translation");
        const isValidInput = this.#validateWord(selector);
        return this.#validInput(selector, isValidInput);
    }

    #sourceLanguageIsValid() {
        const selector = document.querySelector("#add-source-language");
        const isValidInput = this.#validateLanguage(this.sourceLanguage);
        const noDuplicate = this.sourceLanguage !== this.targetLanguage;
        return (this.#validInput(selector, noDuplicate && isValidInput));
    }

    #translationLanguageIsValid() {
        const selector = document.querySelector("#add-translation-language");
        const isValidInput = this.#validateLanguage(this.targetLanguage);
        const noDuplicate = this.sourceLanguage !== this.targetLanguage;
        return (this.#validInput(selector, noDuplicate && isValidInput));
    }

    async readyToUpload(deck) {
        return (this.sourceLanguage !== this.targetLanguage) && (await this.#sourceLanguageIsValid() && await this.#translationLanguageIsValid() &&
            this.#sourceIsValid(deck) && this.#translationIsValid());
    }

    languageIsReady(selector) {
        const lang = selector.value;
        const noDuplicate = this.sourceLanguage !== this.targetLanguage;
        const isValidInput = this.#validateLanguage(lang);
        return (this.#validInput(selector, noDuplicate && isValidInput));
    }

    wordIsReady(selector) {
        const word = selector.value;
        return this.#validInput(selector, this.#validateWord(selector));
    }



}