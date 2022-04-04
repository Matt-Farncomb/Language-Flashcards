class CustomCard {

    #availableLanguages; 

    constructor(languages) {
        this.#availableLanguages = languages;
        this.test = "test";
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

    async #validateLanguage(...args) { 
        const userInputLanguage = args[0];
        const availableLanguages = args[1];
        const data = await availableLanguages;
        return data.includes(userInputLanguage);        
    }

    async #validInput(input, selector, inputValidatorFunc) {
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
        return this.#validInput(this.word, selector, this.#validateWord(this.word));
    }

    #translationIsValid() {
        const selector = document.querySelector("#add-translation");
        this.#validInput(this.translation, selector, this.#validateWord(this.translation))
    }

    #sourceLanguageIsValid() {
        const selector = document.querySelector("#add-source-language");
        return this.#validInput(this.sourceLanguage, selector, this.#validateLanguage(this.sourceLanguage, this.#availableLanguages));
    }

    #translationLanguageIsValid() {
        const selector = document.querySelector("#add-translation-language");
        const test =  this.#validInput(this.targetLanguage, selector, this.#validateLanguage(this.targetLanguage, this.#availableLanguages));
        console.log(test);
        return test;
    }

    readyToUpload(deck) {
        return (this.#sourceLanguageIsValid() && this.#translationLanguageIsValid() &&
             this.#sourceIsValid(deck) && this.#translationIsValid());
    }

    languageIsReady(selector) {
        const lang = selector.value;
        return this.#validInput(lang, selector, this.#validateLanguage(lang, this.#availableLanguages));
    }



}