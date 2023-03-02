class Word {

    private _word: string; 
    private _id: number | null;
    private _language: string | null;
    private _parent: number | null;

    constructor(word: string, id: number | null=null, language: string | null=null, parent: number | null=null) {
        this._word = word;
        this._id = id;
        this._language = language;
        this._parent = parent;
    }

    public get id() {
        return this._id;
    }

    public get word() {
        return this._word;
    }

    public get language() {
        return this._language;
    }

    public get parent() {
        return this._parent;
    }

}