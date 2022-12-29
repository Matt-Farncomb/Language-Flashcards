class BaseCard {

    protected _id: string;
    protected _sourceLanguage: string;
    protected _targetLanguage: string;
    protected _sourceWord: string;
    protected _translations: Word[];
    protected _audio: Blob | null

    constructor(id: string, sourceWord: string, translations: Word[], sourceLanguage: string, targetLanguage: string, audio: Blob | null) {
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