class PlayingCard extends BaseCard {

    private _incorrectCount: number;
    private _correctCount: number;
    private _difficulty: string;

    constructor(id: string, sourceWord: string, translations: Word[], sourceLanguage: string, targetLanguage: string, audio: Blob | null) { 
        super(id, sourceWord, translations, sourceLanguage, targetLanguage, audio);
        this._incorrectCount = this.incorrectCount;
        this._correctCount = this.correctCount;
        this._difficulty = this.difficulty;
    }

    public get incorrectCount() {
        return this._incorrectCount;
    }

    public get correctCount() {
        return this._correctCount;
    }

    public get difficulty() {
        return this._difficulty;
    }

    public updateLocalScore(score: number) {
        this._correctCount += score;
    }

    public serialiseData(): string {
        return JSON.stringify({
            id: this.id,
            sourceWord: this.sourceWord,
            translations: this.translations
            // etc
        })
    }

    

}