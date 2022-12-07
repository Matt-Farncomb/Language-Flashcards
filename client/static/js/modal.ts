

// type nullableHTMLInputElement = HTMLInputElement | null | undefined;
type nullableHTMLInputElement = HTMLInputElement | null | undefined;

abstract class Modal {

    private _id: string;
    private _modal: HTMLDivElement | null;
    protected sourceLanguage: HTMLInputElement;
    protected targetLanguage: HTMLInputElement;
    protected submitButton: HTMLButtonElement;

    constructor(id: string) {
        this._id = id;
        this._modal = document.querySelector(`${id}`);

        if (this._modal) {
            this.sourceLanguage = this.nullCheckedQuerySelector(`.source-language`);
            this.targetLanguage = this.nullCheckedQuerySelector(`.translation-language`);
            this.submitButton = this.nullCheckedButtonQuerySelector(`.submit`);

            const inputs: NodeListOf<HTMLInputElement> = this.nullCheckedQuerySelectorAll(`.input`);
            
            // this.sourceLanguage.onchange = () => this.validateLanguages();
            // this.targetLanguage.onchange = () => this.validateLanguages();

            inputs.forEach(input => {
                input.onchange = () => this.validateForSubmit();
            })

            this.addClickEventToSelector(".submit", () => this.submit());
            this.addClickEventToSelector(".clear", () => this.clear());
            this.addClickEventToSelectorAll(".close", () => this.closeModal());

        }
        else {
            throw Error(`${this._id} modal cannot be found`);
        }

    }

    protected get id() {
        return this._id;
    }

    protected get modal() {
        return this._modal;
    }

    addClickEventToSelector(selector: string, callback: ()=> void ): void {
        const button: HTMLButtonElement | undefined = this.modal.querySelector(selector);
        if (button) {
            button.addEventListener('click', () => callback() );
        }
        else logError(`Could not assign 'click' to ${selector} in ${this.id}`);
        // failedFunctionError(`Could not assign 'click' to ${selector} in ${this.id}`);
    }
    
    addClickEventToSelectorAll(selector: string, callback: ()=> void ): void {
        const elements: NodeListOf<HTMLButtonElement> | undefined = this.modal.querySelectorAll(selector);
        if (elements && elements.length > 0) {
            elements.forEach(element => {
                element.addEventListener('click', () => callback() );
            });
        }
        else logError(`Could not assign 'click' to ${selector} in ${this.id}`);
    }

    nullCheckedQuerySelector(selector: string): HTMLInputElement {
        const element: nullableHTMLInputElement = this.modal?.querySelector(selector);
        if (element) {
            return element;
        }
        throw new Error(`Cannot find ${selector} in ${this._id}`);
    }

    nullCheckedButtonQuerySelector(selector: string): HTMLButtonElement {
        const element: HTMLButtonElement | undefined | null = this.modal?.querySelector(selector);
        if (element) {
            return element;
        }
        throw new Error(`Cannot find ${selector} in ${this._id}`);
    }

    nullCheckedQuerySelectorAll(selector: string): NodeListOf<HTMLInputElement> {
        const elements: NodeListOf<HTMLInputElement> | undefined = this.modal?.querySelectorAll(selector);
        if (elements && elements.length > 0) {
            return elements;
        }
        throw new Error(`Cannot find ${selector} in ${this._id}`);
    }

    public openModal() {
        if (this.modal) this.modal.classList.toggle("is-active");
    }

    private closeModal() {
        if (this.modal) this.modal.classList.toggle("is-active");
    }

    private validateLanguage(languageInput: HTMLInputElement): boolean {
        if (languageInput.value in Server.validLangauges) {
            languageInput.classList.add("is-primary");
            languageInput.classList.remove("is-danger")
            return true;
        } else {
            languageInput.classList.add("is-danger");
            languageInput.classList.remove("is-primary");
            return false;
        }
    }

    protected validateLanguages(): boolean {
        return this.validateLanguage(this.sourceLanguage) && this.validateLanguage(this.targetLanguage);         
    }

    protected clear() {
        if (this.modal) {
            const inputs: NodeListOf<HTMLInputElement> = this.modal.querySelectorAll(".input");
            if (inputs.length > 0) {
                inputs.forEach(element => {
                    element.value = "";
                })
            } else {
                logError(`Unable to find inputs in ${this._id}`);
            }
        }

    }


    abstract submit(): void;

    abstract validateForSubmit(): void;

}

abstract class CardModal extends Modal {

    protected recorder;
    protected sourceWord: HTMLInputElement;
    protected translations: NodeListOf<HTMLInputElement>;
    // protected translations = { "inputs": [],  "values": []};
    
    // protected translations: NodeListOf<HTMLInputElement>;

    constructor(id: string) {
        super(id);
        

        // if modal not found, base will throw errors
        if (this.modal) {

            // const sourceWord: nullableHTMLInputElement = this.modal.querySelector(`.source-language`);
            this.sourceWord = this.nullCheckedQuerySelector(`.source`);
            this.translations = this.nullCheckedQuerySelectorAll(`.translation`);

            const recorderDiv = this.nullCheckedQuerySelector(`.recorder`);
            this.recorder = new Recorder(recorderDiv);

            // this.sourceWord.onchange = () => this.validateForSubmit();
            // this.translations.forEach(translation => translation.onchange = () => this.validateForSubmit());
                
           
        }
    }

    validateForSubmit(): void {
        if (this.validateWords() && this.validateLanguages()) {
            this.submitButton.classList.remove("disabledPointer");
        } else {
            this.submitButton.classList.add("disabledPointer");
        }    
    }

    validateWord(wordInput: HTMLInputElement):boolean {
        if (wordInput.validity.patternMismatch || wordInput.value == "") {
            wordInput.classList.add("is-primary");
            wordInput.classList.remove("is-danger")
            return true;
        }
        else {
            wordInput.classList.add("is-danger");
            wordInput.classList.remove("is-primary");
            return false;
        } 
    }

    translationValues() {
        const values: string[] = [];
        this.translations.forEach(element => values.push(element.value));
        return values;
    }

    validateWords() {
        const validations: boolean[] = [];

        validations.push(this.validateWord(this.sourceWord))

        if (this.translations) {
            this.translations.forEach(element => {
                validations.push(this.validateWord(element));
            })
        }

        return !validations.includes(false)

    }
}

class CreateDeckModal extends CardModal {

    private deck: BaseCard[];

    constructor(id: string) {
        super(id);

        if (this.modal) {

            // const addCard: nullableHTMLInputElement = this.modal.querySelector(`.add-card`);

            this.addClickEventToSelector(`.add-card`,  this.addCardToDeck);

            // if (addCard) {
            //     addCard.addEventListener('click', () => {
            //         this.addCardToDeck();
            //     })
            // }
        }

    }


    addCardToDeck() {
        if (this.sourceWord) {
            const card = new BaseCard(this.id, this.sourceWord.value, this.translationValues(), this.sourceLanguage.value, this.targetLanguage.value, this.recorder.clip);
            this.deck.push(card);
            this.clear();
        }
    }

    submit() {

    }
}

class EditCardModal extends CardModal {

    private card: BaseCard;

    constructor(id: string) {
        super(id);
        this.buildTranslationInputList();
    }

    buildTranslationInputList() {
        const translationinputs = this.nullCheckedQuerySelectorAll(".translation");
        if (translationinputs) translationinputs.forEach(element => {
            const template: HTMLTemplateElement | null = document.querySelector('.translation-template');
            element.addEventListener('click', (e) => {
                if (template && 'content' in document.createElement('template')) {
                    // const clicked = e.target as HTMLElement;
                    // const translationsBlock = clicked?.parentElement?.parentElement?.parentElement?.parentElement;
                    // const translationsBlock: HTMLTemplateElement | null = this.modal!.querySelector('.translation-block');
                    const translationsBlock: nullableHTMLInputElement = this.nullCheckedQuerySelector('.translation-block')
                    if (translationsBlock) {
                        const clone = (template.content.cloneNode(true) as HTMLDivElement);
                        translationsBlock.appendChild(clone);
                        const removeButton = clone.querySelector(".remove-translation");
                        if (removeButton) {
                            removeButton.addEventListener(
                                'click' , (e) => {
                                    const clicked = e.target as HTMLElement;
                                    clicked?.parentElement?.parentElement?.remove();
                                }
                            );
                        }
                    } else {
                        logError(`translation-block not found in ${this.id}`)
                    }

                } else {
                    console.log("Cant't add");
                }
            })
        })
    }
    // tTODO: takes only language pair or null so some modals can just not use the argument
    openModal(): void {
        super.openModal();
        if (this.sourceLanguage && this.targetLanguage && this.sourceWord && this.translations.length > 0) {
            this.sourceLanguage.value = this.card.sourceLanguage;
            this.targetLanguage.value = this.card.targetLanguage;
            this.sourceWord.value = this.card.sourceLanguage;
            for (let i = 0; i > this.translations.length; i++) {
                this.translations[i].value = this.card.translations[i];
            }
        }

    }

    populateCard(card: PlayingCard) {
        this.card = card;
        if (this.sourceLanguage && this.targetLanguage && this.sourceWord && this.translations.length > 0) {
            this.sourceLanguage.value = card.sourceLanguage;
            this.targetLanguage.value = card.targetLanguage;
            this.sourceWord.value = card.sourceLanguage;
            for (let i = 0; i > this.translations.length; i++) {
                this.translations[i].value = card.translations[i];
            }
        }
    }

    submit(): void {
        Server.postEdit(this.card);
    }
}

class FetchDeckModal extends Modal {

    count: HTMLInputElement;

    constructor(id: string) {
        super(id);
        this.count = this.nullCheckedQuerySelector(".count");
    }

    validateCount() {
        const number = parseInt(this.count.value);
        return ( number <= 10 && number > 0)
    }

    submit(): void {
        this.fetchDeck();
    }

    validateForSubmit(): void {
        if (this.validateLanguages() && this.validateCount()) {
            this.submitButton.classList.remove("disabledPointer");
        } else {
            this.submitButton.classList.add("disabledPointer");
        }    
    }

    async fetchDeck() {
        const jsonDeck:Response = await Server.getDeck(this.count.value, this.sourceLanguage.value, this.targetLanguage.value);
        console.log(jsonDeck);
        // const serializedDeck = deck.map( element => element.serialiseData() )
        // localStorage.setItem("deck", JSON.stringify(serializedDeck));
    }

}

class FetchTableModal extends Modal {

    submit(): void {
        Server.goToTable(this.sourceLanguage.value, this.targetLanguage.value);
    }

    validateForSubmit(): void {
        if (this.validateLanguages()) {
            this.submitButton.classList.remove("disabledPointer");
        } else {
            this.submitButton.classList.add("disabledPointer");
        }    
    }
}