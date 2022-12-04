class UploadCard extends BaseCard {

    constructor(id: string, sourceWord: string, translations: string[], sourceLanguage: string, targetLanguage: string, audio: Blob) {
        super();
        this._id = id;
        this._sourceWord = sourceWord; 
        this._translations = translations;
        this._sourceLanguage = sourceLanguage;
        this._targetLanguage = targetLanguage;
        this._audio = audio;
    }

}