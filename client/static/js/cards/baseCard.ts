class BaseCard {

    protected _id: string;
    protected _sourceLanguage: string;
    protected _targetLanguage: string;
    protected _sourceWord: string;
    protected _translations: string[];
    protected _audio: Blob

    constructor(id: string, sourceWord: string, translations: string[], sourceLanguage: string, targetLanguage: string, audio: Blob) {
        this._id = id;
        this._sourceWord = sourceWord; 
        this._translations = translations;
        this._sourceLanguage = sourceLanguage;
        this._targetLanguage = targetLanguage;
        this._audio = audio;
    }

    public get id() {
        return this._id;
    }

    public get sourceLanguage() {
        return this._sourceLanguage;
    }

    public get targetLanguage() {
        return this._targetLanguage;
    }

    public get sourceWord() {
        return this._sourceWord;
    }

    public get translations() {
        return this._translations;
    }

    public get audio() {
        return this._audio;
    }

}