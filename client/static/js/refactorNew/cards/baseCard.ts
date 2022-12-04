class BaseCard {

    protected _id: string;
    protected _sourceLanguage: string;
    protected _targetLanguage: string;
    protected _sourceWord: string;
    protected _translations: string[];
    protected _audio: Blob

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