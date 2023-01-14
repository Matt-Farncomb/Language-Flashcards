class UiCard {

    private cardDiv: HTMLDivElement | null;
    private _sourceWord: HTMLSpanElement;
    private _translations: HTMLUListElement;
    public audio: HTMLAudioElement | undefined;

    // nextCard: HTMLAnchorElement;
    // edit: HTMLAnchorElement;
    // play: HTMLButtonElement;
    // flip: NodeListOf<HTMLButtonElement>;

    constructor(clip: HTMLAudioElement | undefined) {
        this.cardDiv = document.querySelector(".outer-card");
        this.audio = clip;
        
        if (this.cardDiv) {
            const sourceWord: HTMLSpanElement | null = this.cardDiv.querySelector(".front .card-content span");
            const translations: HTMLUListElement | null = this.cardDiv.querySelector(".back .card-content span");
            console.log(sourceWord)
            console.log(translations)

            if (sourceWord && translations) {
                this._sourceWord = sourceWord;
                this._translations = translations;
            } 
            else {
                throw Error("sourceWord or translations were not found");
            }
        }
        else {
            throw Error("cardDiv was not found");
        }
    }

    set sourceWord(value: string) {
        this._sourceWord.innerHTML = value;
    }

    set translations(values: string[]) {
        this._translations.innerHTML = "";
        values.forEach(value => {
            const li = document.createElement("li");
            li.innerHTML = value;
            this._translations.append(li);
        })
    }

    update(card: TestCard, audioURL: string) {
        console.log("updating")
        console.log(card)
        if (card.sourceWord) {
            this.sourceWord = card.sourceWord;
        }
        this.translations = card.translations;
        if (this.audio) {
            this.audio.src = audioURL;
        }
    }
}