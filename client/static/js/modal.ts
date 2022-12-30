abstract class Modal {

    private _id: string;
    private _modal: HTMLDivElement;
    protected sourceLanguage: LanguageInput;
    protected targetLanguage: LanguageInput;
    protected submitButton: HTMLButtonElement;
    // protected inputs: ExtendedInput[] = [];

    constructor(id: string) {
        this._id = id;
        
        const modal: HTMLDivElement | null = document.querySelector(`${id}`);
        const sourceLanguage = nullCheckedQuerySelector(modal, `.source-language`);
        const targetLanguage = nullCheckedQuerySelector(modal, `.translation-language`);

        if (modal && sourceLanguage && targetLanguage) {

            this._modal = modal;
            // this.sourceLanguage = new LanguageInput(sourceLanguage)
            // this.targetLanguage = new LanguageInput(targetLanguage)

            this.sourceLanguage = this.createNewInput(LanguageInput, sourceLanguage);
            this.targetLanguage = this.createNewInput(LanguageInput, targetLanguage);

            this.targetLanguage.addSibling(this.sourceLanguage);
            this.sourceLanguage.addSibling(this.targetLanguage);
            // this.inputs.push(this.sourceLanguage, this.targetLanguage);
            
            this.submitButton = this.nullCheckedButtonQuerySelector(`.submit`);

            this.addClickEventToModalElement(".submit", () => this.submit());
            this.addClickEventToModalElement(".clear", () => this.clear());
            this.addClickEventToModalElements(".close", () => this.closeModal());

            // this.inputs.forEach(element => {
            //     element.addOnChangeEvent(() => console.log("farts are smelly"));
            // })

            // this.sourceLanguage.addOnChangeEvent(() => console.log("farts are smelly"))
            // this.targetLanguage.addOnChangeEvent(() => console.log("farts are smelly"))
            
        }
        else {
            throw Error(`${this.id} modal cannot be found`);
        }

    }

    protected get id() {
        return this._id;
    }

    protected get modal() {
        return this._modal;
    }

    protected updateInputValue(input: HTMLInputElement, value: string) {
        input.value = value;
        input.dispatchEvent(new Event('change'));   
    }

 
    addClickEventToModalElement(selector: string, callback: ()=> void ): void {
        const button: HTMLButtonElement | null = this.modal.querySelector(selector);
        if (button) {
            button.addEventListener('click', () => callback() );
        } else logError(`Could not assign 'click' to ${selector} in ${this.id}`);
    }
        

    addClickEventToModalElements(selector: string, callback: ()=> void ): void {
        const elements: NodeListOf<HTMLButtonElement> = this.modal.querySelectorAll(selector);
        if (elements.length > 0) {
            elements.forEach(element => {
                element.addEventListener('click', () => callback() );
            });
        }
        else logError(`Could not assign 'click' to ${selector} in ${this.id}`);
    }
    
    nullCheckedButtonQuerySelector(selector: string): HTMLButtonElement {
        const element: HTMLButtonElement | null = this.modal.querySelector(selector);
        if (element) {
            return element;
        }
        throw new Error(`Cannot find ${selector} in ${this._id}`);
    }

    nullCheckedQuerySelectorAll(selector: string): NodeListOf<HTMLInputElement> {
      
        const elements: NodeListOf<HTMLInputElement> | undefined = this.modal.querySelectorAll(selector);

        if (elements && elements.length > 0) {
            return elements;
        } else {
            throw new Error(`Cannot find ${selector} in ${this._id}`);
        }
        
    }

    protected lockDownInput(selector: string) {
        this.nullCheckedQuerySelectorAll(selector).forEach(input => input.classList.add("no-click"));
    }

    protected unlockInput(selector: string) {
        this.nullCheckedQuerySelectorAll(selector).forEach(input => input.classList.remove("no-click"));
    }

    public openModal() {
        this.modal.classList.toggle("is-active");
    }

    protected closeModal() {
        if (this.modal) {
            this.clear();
            this.modal.classList.toggle("is-active");
        }
    }


    protected createNewInput(input: typeof WordInput | typeof LanguageInput | typeof NumberInput, element: HTMLInputElement) {
        const newInput = new input(element);
        newInput.addOnChangeEvent(() => this.toggleSubmitButton());
        return newInput;
        // return (new input(element).addOnChangeEvent(() => this.toggleSubmitButton());)

    }

    protected clear() {
        if (this.modal) {
            const inputs: NodeListOf<HTMLInputElement> = this.modal.querySelectorAll(".input");
            if (inputs.length > 0) {
                inputs.forEach(element => {
                    element.value = "";
                    // this.updateInputValue(element, "");
                    element.classList.remove("is-danger","is-primary");
                })
            } else {
                logError(`Unable to find inputs in ${this._id}`);
            }
        }

    }


    abstract submit(): void;

    async readyToSubmit(): Promise<boolean> {
        return await this.sourceLanguage.isReady() && this.targetLanguage.isReady();
    }

    revealSubmitButton() {
        this.modal.querySelector(".submit")?.classList.remove("disabledPointer");
    }

    hideSubmitButton() {
        this.modal.querySelector(".submit")?.classList.add("disabledPointer");
    }

    protected async toggleSubmitButton() {
        if (await this.readyToSubmit()) {
            this.revealSubmitButton();
        } else {
            this.hideSubmitButton();
        }
    }

}



abstract class CardModal extends Modal {

    protected recorder;
    protected sourceWord: WordInput;
    protected translations: WordInput[] = [];    

    protected card: BaseCard | undefined;

    constructor(id: string) {
        super(id);
        

        const sourceWord: HTMLInputElement | undefined = nullCheckedQuerySelector(this.modal, `.source`);
        const translations: NodeListOf<HTMLInputElement> | undefined = this.nullCheckedQuerySelectorAll(`.translation`);
        const recorderDiv: HTMLDivElement | null  = this.modal.querySelector(`.recorder`);

        // if modal not found, base will throw errors
        if (sourceWord && translations.length > 0 && recorderDiv) {

            this.sourceWord = this.createNewInput(WordInput, sourceWord);
            this.recorder = new Recorder(recorderDiv);
                      
            // create a word input for every translation
            translations.forEach(inputElement => this.translations.push(this.createNewInput(WordInput, inputElement)));
            // every translation word input gets every other translation word input added as a sibling
            this.translations.forEach(wordInput => {
                wordInput.addSiblings(this.translations);
                // wordInput.addOnChangeEvent(() => console.log("farts are smelly"));
                }
            );
        } else {
            throw Error(`Class 'source' or 'translation' could not be found in ${this.id}`);
        }
    }

    validateWord(wordInput: HTMLInputElement):boolean {
        if (wordInput.validity.patternMismatch || wordInput.value == "") {
            wordInput.classList.add("is-danger");
            wordInput.classList.remove("is-primary");
            return false;
        }
        else {
            wordInput.classList.add("is-primary");
            wordInput.classList.remove("is-danger")
            return true;
        } 
    }

    // make list of translations available
    public translationValues() {
        const values: string[] = [];
        this.translations.forEach(element => values.push(element.value));
        console.log(values);
        return values;
    }

    protected cloneInputBlockFromTemplate(): HTMLDivElement | undefined {
        const template: HTMLTemplateElement | null = document.querySelector('.translation-template');
        if (template && 'content' in document.createElement('template')) {
            const clone = (template.content.cloneNode(true) as HTMLDivElement);
            return clone;       
        } else {
            logError("Could not create clone");
        }
    }

    protected addClonedInputToBlock(clone: HTMLDivElement): HTMLInputElement | undefined {
        const translationsBlock: HTMLInputElement | undefined = nullCheckedQuerySelector(this.modal, '.translations-block');
        if (translationsBlock) {
            translationsBlock.appendChild(clone);
            const previouslyAddedTranslation = translationsBlock.lastElementChild;
            if (previouslyAddedTranslation) {
                const translationJustAdded: HTMLInputElement | null = previouslyAddedTranslation.querySelector(".translation");
                if (translationJustAdded) {
                    return translationJustAdded;
                }
            }
        }
    }

    protected addInput() {
        
        const clone: HTMLDivElement | undefined = this.cloneInputBlockFromTemplate();
        if (clone) {
            const translationJustAdded = this.addClonedInputToBlock(clone); 
            if (translationJustAdded) {
                const newWordInput = this.createNewInput(WordInput, translationJustAdded);
                newWordInput.addSiblings(this.translations);
                this.translations.forEach(wordInput => wordInput.addSibling(newWordInput));
                this.translations.push(newWordInput);
                const removeButton = translationJustAdded.parentElement?.querySelector(".remove-translation");
                if (removeButton) {
                    console.log("removing")
                    removeButton.addEventListener(
                        'click' , (e) => {
                            console.log("removed")
                            const clicked = e.target as HTMLElement;
                            clicked?.parentElement?.parentElement?.remove();
                        })
                    }
                }
            } else {
                logError(`translation-block not found in ${this.id}`)
            }
            
        
    }

    protected addInputOnClick() {
        // const translationinputs = this.nullCheckedQuerySelectorAll(".translation");
        const translationinput = this.modal.querySelector(".translation");
        if (translationinput) {
            if (translationinput.parentElement) {
                const addButton = translationinput.parentElement.querySelector(".add-translation");
                const template: HTMLTemplateElement | null = document.querySelector('.translation-template');
                if (addButton) {
                    addButton.addEventListener('click', (e) => {
                        if (template && 'content' in document.createElement('template')) {
                            this.addInput();
                        } else {
                            logError("Cant't add click event on plus icon");
                        }
                    })
                }
            }
        }
    }   

    async allTranslationsAreValid() {
        // const areAllValuesValid = (translations: WordInput[]) => translations.every(translation => await translation.isValid());
        for (let translation of this.translations) {
            if (!await translation.isReady()) {
                return false;
            }
        }
       return true;
    }

    async readyToSubmit(): Promise<boolean> {
        const baseInputsReady = await super.readyToSubmit();
        const sourceWordReady = await this.sourceWord.isValid();
        const translationsReady = await this.allTranslationsAreValid();
        return baseInputsReady && sourceWordReady && translationsReady;
    }

    protected closeModal(): void {
        super.closeModal();
        console.log("fart");
        const addedInputs = this.translations.slice(1);
        addedInputs.forEach(input => input.removeFromDOM());
        // TODO: Need to also remove each added input from remaining inputs siblings and list of translations 
    }

}

class CreateDeckModal extends CardModal {

    private deck: BaseCard[] = [];

    constructor(id: string) {
        super(id);
        this.addInputOnClick();
        
        const upload: HTMLButtonElement | null = this.modal.querySelector(`.upload-deck`);

        if (upload) {
            upload.addEventListener('click', () => {
                Server.uploadDeck(this.deck);
                this.closeModal();
            })
        }
    }

    async readyToSubmit(): Promise<boolean> {
        const baseInputsReady = await super.readyToSubmit();
        return baseInputsReady;
    }

    clearWords() {
        const wordInputs: NodeListOf<HTMLInputElement> = this.modal.querySelectorAll(".word");
        if (wordInputs.length > 0) {
            wordInputs.forEach(element => {
                element.value = "";
                // this.updateInputValue(element, "");
                element.classList.remove("is-danger","is-primary");
            })
        } else {
            logError(`Unable to find word inputs in ${this.id}`);
        }
    }

    closeModal() {
        super.closeModal();
        this.unlockInput(".language");
        this.deck = [];
    }

    addCardToDeck() {
        this.card = new BaseCard(
            this.id, 
            this.sourceWord.value, 
            this.translationValues().map(translation => new Word(translation)), 
            this.sourceLanguage.value, 
            this.targetLanguage.value, 
            this.recorder.clip ? this.recorder.clip : null
        );
        this.deck.push(this.card);
        this.clearWords();
        this.lockDownInput(".language");
    }

    revealUploadButton() {
        this.modal.querySelector(".upload-deck")?.classList.remove("disabledPointer");
    }

    hideUploadButton() {
        this.modal.querySelector(".upload-deck")?.classList.add("disabledPointer");
    }

    submit() {
      this.addCardToDeck();
      this.revealUploadButton();
    }
}

class EditCardModal extends CardModal {

    // card will be initialised whenever this modal is opened

    constructor(id: string) {
        super(id);
        // this.buildTranslationInputList();

    }

    openModal(): void {
        super.openModal();
    }

    // removeTranslationInput() {
    //     const translationBlock = this.modal.querySelector(".translations-block");
    //     console.log(translationBlock);
    //     if (translationBlock) {
    //         translationBlock.innerHTML = "";
    //     }
       

    // }

    private buildInputList(translations: Word[]) {
        translations.forEach(translation => {
            const clone: HTMLDivElement | undefined = this.cloneInputBlockFromTemplate();
            if (clone) {
                const translationJustAdded = this.addClonedInputToBlock(clone); 
                if (translationJustAdded) {
                    const newWordInput = this.createNewInput(WordInput, translationJustAdded);
                    newWordInput.value = translation.word;
                    newWordInput.addSiblings(this.translations);
                    this.translations.forEach(wordInput => wordInput.addSibling(newWordInput));
                    this.translations.push(newWordInput);
                    const removeButton = translationJustAdded.parentElement?.querySelector(".remove-translation");
                    if (removeButton) {
                        console.log("removing")
                        removeButton.addEventListener(
                            'click' , (e) => {
                                console.log("removed")
                                const clicked = e.target as HTMLElement;
                                clicked?.parentElement?.parentElement?.remove();
                            })
                        }
                    }
                } else {
                    logError(`translation-block not found in ${this.id}`)
                }
            }
        )
    }

    populateCard(card: BaseCard) {
        this.card = card;
        this.translations[0].value = card.translations[0].word;
        if (card.translations.length > 1) {
            // this.removeTranslationInput();
            this.buildInputList(card.translations.slice(1));
        }
        this.addInputOnClick();
        
        if (this.sourceLanguage && this.targetLanguage && this.sourceWord && this.translations.length > 0) {
            this.sourceLanguage.value = languageAbbreviations[card.sourceLanguage];
            this.targetLanguage.value = languageAbbreviations[card.targetLanguage];
            this.sourceWord.value = card.sourceWord;
            console.log(card.translations.length)
            for (let i = 0; i > this.translations.length; i++) {
                this.translations[i].value = card.translations[i].word;
            }
        }
    }

    submit(): void {
        if (this.card) {
            Server.postEdit(this.card);
        }
    }
}

class FetchDeckModal extends Modal {

    count: NumberInput;

    constructor(id: string) {
        super(id);

        const count: HTMLInputElement | undefined = nullCheckedQuerySelector(this.modal, ".count");

        if (count) {
            this.count = this.createNewInput(NumberInput, count);
        }
        else {
            throw Error(`Class 'count' cannot be found in ${this.id}`);
        }
    }

    submit(): void {
        this.fetchDeck();
    }

    async readyToSubmit(): Promise<boolean> {
        return await super.readyToSubmit() && await this.count.isValid(); 
    }
    
    async fetchDeck(): Promise<void> {
        const deck:any = await Server.getDeck(this.count.value, this.sourceLanguage.value, this.targetLanguage.value);
    }

}

class FetchTableModal extends Modal {

    submit(): void {
        Server.goToTable(this.sourceLanguage.value, this.targetLanguage.value);
    }
}