class TestCard {

    protected _id: string;
    protected _audio: Blob | undefined;
    private modal: CardModal
    private modalDiv: HTMLDivElement;

    constructor(modal: CardModal, id: string) {
        this.modal = modal;
        this.modalDiv = modal.modal;
        this._id = id;
    }

    public get id() {
        return this._id;
    }

    public get sourceLanguage() {
        const sourceLanguage: HTMLInputElement | null = this.modalDiv.querySelector(".source-language");
        if (sourceLanguage) {
            return sourceLanguage.value;
        }
        console.log("ccan't find source language")
        
    }

    public get targetLanguage() {
        const targetLanguage: HTMLInputElement | null = this.modalDiv.querySelector(".translation-language");
        if (targetLanguage) {
            return targetLanguage.value;
        }
        console.log("ccan't find target Language")
        
    }

    public get sourceWord() {
        const sourceWord: HTMLInputElement | null = this.modalDiv.querySelector(".source");
        if (sourceWord) {
            return sourceWord.value;
        }
        console.log("ccan't find source Word")
        
    }

    public get translations() {
        const translation_values: string[] = [];
        const translation_inputs: NodeListOf<HTMLInputElement> = this.modalDiv.querySelectorAll(".translation");
        if (translation_inputs.length > 0 ) {
            translation_inputs.forEach(element => translation_values.push(element.value));
        }
        else {
            console.log("ccan't find source translations")
        }
        return translation_values;
    }

    public get audio()  {
        const clip = this.modal.recorder.clip;
        console.log(clip);
        return clip;
    }

}