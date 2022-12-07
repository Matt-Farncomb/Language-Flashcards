class PlayingCard extends BaseCard {

    #incorrectCount: number;
    #correctCount: number;
    #difficulty: string;

    constructor(id: string, sourceWord: string, translations: string[], sourceLanguage: string, targetLanguage: string, audio: Blob) { 
        super(id, sourceWord, translations, sourceLanguage, targetLanguage, audio);
        this.#incorrectCount = this.incorrectCount;
        this.#correctCount = this.correctCount;
        this.#difficulty = this.difficulty;
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