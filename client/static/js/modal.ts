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

    public openModal() {
        this.modal.classList.toggle("is-active");
    }

    private closeModal() {
        if (this.modal) {
            this.clear();
            this.modal.classList.toggle("is-active");
        }
    }


    private async languageIsValid(languageInput: HTMLInputElement) {
        const awaitedLanguages = await Server.validLangauges;
        return awaitedLanguages.includes(languageInput.value) && this.notDuplicateLanguage()
    }

    protected createNewInput(input: typeof WordInput | typeof LanguageInput, element: HTMLInputElement) {
        const test = new input(element);
        test.addOnChangeEvent(() => console.log("farting!!!"));
        return test;
    }

    // private async showIfInputIsValid(input: HTMLInputElement, isValid:boolean) {
    //     if (isValid) {
    //         input.classList.add("is-primary");
    //         input.classList.remove("is-danger")
    //     } else {
    //         input.classList.add("is-danger");
    //         input.classList.remove("is-primary");
    //     }
    // }

    // private async newvalidateForSubmit() {
    //     const isSourceLanguageValid = this.languageIsValid(this.sourceLanguage);
    //     const isTargetLanguageValid = this.languageIsValid(this.targetLanguage);
    // }



    // private async validateLanguage(languageInput: LanguageInput): Promise<boolean> {
    //     const awaitedLanguages = await Server.validLangauges;
    //     console.log("called");
    //     if (awaitedLanguages.includes(languageInput.value) && this.notDuplicateLanguage()) {  
    //         languageInput.classList.add("is-primary");
    //         languageInput.classList.remove("is-danger")
    //         return true;
    //     } else {
    //         languageInput.classList.add("is-danger");
    //         languageInput.classList.remove("is-primary");
    //         return false;
    //     }
    // }

    private notDuplicateLanguage() {
        return this.sourceLanguage.value != this.targetLanguage.value;
    }

    // protected async validateLanguages(): Promise<boolean> {
    //     return await this.validateLanguage(this.sourceLanguage) && await this.validateLanguage(this.targetLanguage);         
    // }

    // protected async newValidateLanguages(): Promise<boolean> {
    //     return await this.languageIsValid(this.sourceLanguage) && await this.languageIsValid(this.targetLanguage);         
    // }

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
        return await this.sourceLanguage.isValid() && await this.targetLanguage.isValid()
    }

}



abstract class CardModal extends Modal {

    // protected recorder;
    protected sourceWord: WordInput;
    protected translations: WordInput[] = [];    

    constructor(id: string) {
        super(id);
        this.buildTranslationInputList();

        const sourceWord: HTMLInputElement | undefined = nullCheckedQuerySelector(this.modal, `.source`);
        const translations: NodeListOf<HTMLInputElement> | undefined = this.nullCheckedQuerySelectorAll(`.translation`);

        // if modal not found, base will throw errors
        if (sourceWord && translations.length > 0) {

            this.sourceWord = this.createNewInput(WordInput, sourceWord);
            // this.sourceWord = new WordInput(sourceWord);
            // this.sourceWord.addOnChangeEvent(() => console.log("farts are smelly"));
            // this.inputs.push(sourceWord);
            
           
            // create a word input for every translation
            translations.forEach(inputElement => this.createNewInput(LanguageInput, inputElement));
            // every translation word input gets every other translation word input added as a sibling
            this.translations.forEach(wordInput => {
                wordInput.addSiblings(this.translations);
                // wordInput.addOnChangeEvent(() => console.log("farts are smelly"));
                }
            );

            // const recorderDiv = this.modalQuerySelector(`.recorder`);
            // this.recorder = new Recorder(recorderDiv);
 
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
        return values;
    }

    buildTranslationInputList() {
        const translationinputs = this.nullCheckedQuerySelectorAll(".translation");
        if (translationinputs.length > 0) translationinputs.forEach(element => {
            if (element.parentElement) {
                const addButton = element.parentElement.querySelector(".add-translation");
                const template: HTMLTemplateElement | null = document.querySelector('.translation-template');
                if (addButton) {
                    addButton.addEventListener('click', (e) => {
                        if (template && 'content' in document.createElement('template')) {
                            const translationsBlock: HTMLInputElement | undefined = nullCheckedQuerySelector(this.modal, '.translations-block')
                            if (translationsBlock) {
                                const clone = (template.content.cloneNode(true) as HTMLDivElement);
                                translationsBlock.appendChild(clone);
                                const lastTranslation = translationsBlock.lastElementChild;
                                if (lastTranslation) {
                                    const newTranslation: HTMLInputElement | null = lastTranslation.querySelector(".translation");
                                    if (newTranslation) {
                                        // const newWordInput = new WordInput(newTranslation);
                                        const newWordInput = this.createNewInput(WordInput, newTranslation);

                                        newWordInput.addSiblings(this.translations);
                                        this.translations.forEach(wordInput => wordInput.addSibling(newWordInput));
                                        this.translations.push(newWordInput);

                                        // newWordInput.addOnChangeEvent(() => console.log("farts are smelly"));

                                        const removeButton = clone.querySelector(".remove-translation");
                                        if (removeButton) {
                                            removeButton.addEventListener(
                                                'click' , (e) => {
                                                    const clicked = e.target as HTMLElement;
                                                    clicked?.parentElement?.parentElement?.remove();
                                                }
                                            );
                                        }
                                    }
                                    
                                }
                            } else {
                                logError(`translation-block not found in ${this.id}`)
                            }
                        } else {
                            logError("Cant't add click event on plus icon");
                        }
                    })
                }
            }
        })
    }

    async allTranslationsAreValid() {
        // const areAllValuesValid = (translations: WordInput[]) => translations.every(translation => await translation.isValid());
        for (let translation of this.translations) {
            if (!translation.isValid()) {
                return false;
            }
        }
       return true;
    }

    async readyToSubmit(): Promise<boolean> {
        return await super.readyToSubmit() && await this.sourceWord.isValid() && this.allTranslationsAreValid();
    }

}

class CreateDeckModal extends CardModal {

    private deck: BaseCard[] = [];

    constructor(id: string) {
        super(id);

        if (this.modal) {

            // const addCard: nullableHTMLInputElement = this.modal.querySelector(`.add-card`);

            // this.addClickEventToSelector(`.add-card`,  this.addCardToDeck);

            // if (addCard) {
            //     addCard.addEventListener('click', () => {
            //         this.addCardToDeck();
            //     })
            // }
        }

    }


    // addCardToDeck() {
    //     if (this.sourceWord) {
    //         const card = new BaseCard(this.id, this.sourceWord.value, this.translationValues(), this.sourceLanguage.value, this.targetLanguage.value, this.recorder.clip);
    //         this.deck.push(card);
    //         this.clear();
    //     }
    // }

    submit() {

    }
}

class EditCardModal extends CardModal {

    // card will be initialised whenever this modal is opened
    private card: PlayingCard | undefined;

    constructor(id: string) {
        super(id);
        // this.buildTranslationInputList();
    }

    // buildTranslationInputList() {
    //     const translationinputs = this.inputQuerySelectorAll(".translation");
    //     if (translationinputs) translationinputs.forEach(element => {
    //         const template: HTMLTemplateElement | null = document.querySelector('.translation-template');
    //         element.addEventListener('click', (e) => {
    //             if (template && 'content' in document.createElement('template')) {
    //                 // const clicked = e.target as HTMLElement;
    //                 // const translationsBlock = clicked?.parentElement?.parentElement?.parentElement?.parentElement;
    //                 // const translationsBlock: HTMLTemplateElement | null = this.modal!.querySelector('.translation-block');
    //                 const translationsBlock: nullableHTMLInputElement = this.modalQuerySelector('.translation-block')
    //                 if (translationsBlock) {
    //                     const clone = (template.content.cloneNode(true) as HTMLDivElement);
    //                     translationsBlock.appendChild(clone);
    //                     const removeButton = clone.querySelector(".remove-translation");
    //                     if (removeButton) {
    //                         removeButton.addEventListener(
    //                             'click' , (e) => {
    //                                 const clicked = e.target as HTMLElement;
    //                                 clicked?.parentElement?.parentElement?.remove();
    //                             }
    //                         );
    //                     }
    //                 } else {
    //                     logError(`translation-block not found in ${this.id}`)
    //                 }

    //             } else {
    //                 console.log("Cant't add");
    //             }
    //         })
    //     })
    // }
    // tTODO: takes only language pair or null so some modals can just not use the argument
    openModal(): void {
        super.openModal();
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
        if (this.card) {
            Server.postEdit(this.card);
        }
    }
}

class FetchDeckModal extends Modal {

    count: HTMLInputElement;

    constructor(id: string) {
        super(id);

        const count: HTMLInputElement | undefined = nullCheckedQuerySelector(this.modal, ".count");

        if (count) {
            this.count = count;
        }
        else {
            throw Error(`Class 'count' cannot be found in ${this.id}`);
        }
        
    }

    validateCount() {
        const number = parseInt(this.count.value);
        return ( number <= 10 && number > 0)
    }

    submit(): void {
        this.fetchDeck();
    }

    // async validateForSubmit(): Promise<void> {
    //     if (await this.validateLanguages() && this.validateCount()) {
    //         this.submitButton.classList.remove("disabledPointer");
    //     } else {
    //         this.submitButton.classList.add("disabledPointer");
    //     }    
    // }

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

    // async validateForSubmit(): Promise<void> {
    //     if (await this.validateLanguages()) {
    //         this.submitButton.classList.remove("disabledPointer");
    //     } else {
    //         this.submitButton.classList.add("disabledPointer");
    //     }    
    // }
}