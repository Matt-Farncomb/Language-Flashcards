class CustomCard {

    constructor() {
    }

    get word() {
        return document.querySelector("#add-source").value;
    }

    get translation() {
        return document.querySelector("#add-tran").value;
    }

    get sourceLanguage() {
        return document.querySelector("#add-lang").value;
    }

    get targetLanguage() {
        return document.querySelector("#add-tran-lang").value;
    }

    #validateWord() {
        
        throw new Error('Method not implemented.');
    }

    #validateLanguage(language) { 
        return this._server.languages.contains(language);
    }

    #validInput(input, inputId, inputValidatorFunc) {
        const isValid = inputValidatorFunc(input);
        if (isValid) {
            document.querySelector(`#add-${inputId}`).classList.add("is-primary");
            document.querySelector(`#add-${inputId}`).classList.remove("is-danger");
        } else {
            document.querySelector(`#add-${inputId}`).classList.remove("is-primary");
            document.querySelector(`#add-${inputId}`).classList.add("is-danger");
        }
        return isValid;
    }

    #wordIsValid(deck) {
        if (!deck.hasCard(this.word)) {
            return this.#validInput(this.word, "word", this.#validateWord());
        }
        return false;
        
    }

    #translationIsValid() {
        return this.#validInput(this.translation, "translation", this.#validateWord());
    }

    #sourceLanguageIsValid() {
        return this.#validInput(this.sourceLanguage, "source-language", this.#validateLanguage());
    }

    #targetLanguageIsValid() {
        return this.#validInput(this.targetLanguage, "target-language", this.#validateLanguage());
    }

    readyToUpload(deck) {
        return (this.#sourceLanguageIsValid() && this.#targetLanguageIsValid() &&
            this.#wordIsValid(deck) && this.#translationIsValid());
    }



}