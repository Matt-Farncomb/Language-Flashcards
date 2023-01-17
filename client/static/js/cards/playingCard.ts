class PlayingCard extends BaseCard {

    private _difficulty: string;

    constructor(id: string, sourceWord: string, translations: Word[], sourceLanguage: string, targetLanguage: string, audio: Blob | null,
    difficulty: string="medium") 
        { 
        super(id, sourceWord, translations, sourceLanguage, targetLanguage, audio);
        this._difficulty = difficulty;
        }


    public get difficulty() {
        return this._difficulty;
    }

    // public updateLocalScore(score: number) {
    //     this._correctCount += score;
    // }

    public serialiseData(): string {
        return JSON.stringify({
            id: this.id,
            sourceWord: this.sourceWord,
            translations: this.translations
            // etc
        })
    }

    

}