class PlayingCard extends BaseCard {

    #incorrectCount: number;
    #correctCount: number;
    #difficulty: string;

    constructor(jsonString: string) {
        super();
        this._id = jsonString["id"];
        this._sourceWord = jsonString["sourceWord"]; 
        this._translations = jsonString["translations"];
        this._sourceLanguage = jsonString["sourceLanguage"];
        this._targetLanguage = jsonString["targetLanguage"];
        this._audio = jsonString["audio"];
        this.#incorrectCount = jsonString["incorrectCount"];
        this.#correctCount = jsonString["correctCount"];
        this.#difficulty = jsonString["difficulty"];
    }

    public get incorrectCount() {
        return this.#incorrectCount;
    }

    public get correctCount() {
        return this.#correctCount;
    }

    public get difficulty() {
        return this.#difficulty;
    }

    public updateLocalScore(score: number) {
        this.#correctCount += score;
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