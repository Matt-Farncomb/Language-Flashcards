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

    sourceLanguageIsValid() {
        return validLanguage(this.sourceLanguage);
    }

    targetLanguageIsValid() {
        return validLanguage(this.targetLanguage);
    }

    validLanguage(input) {
        return this._server.languages.contains(input);
    }

    wordIsValid() {
        
    }

    translationIsValid() {
        
    }

    readyToUpload() {
        return (sourceLanguageIsValid() && targetLanguageIsValid() &&
            wordIsValid() && translationIsValid());
    }



}