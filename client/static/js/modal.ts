

// type nullableHTMLInputElement = HTMLInputElement | null | undefined;
type nullableHTMLInputElement = HTMLInputElement | null | undefined;

abstract class Modal {

    private _id: string;
    private _modal: HTMLDivElement | null;
    protected sourceLanguage: LanguageInput;
    protected targetLanguage: LanguageInput;
    protected submitButton: HTMLButtonElement;

    private _languageInputs: LanguageInput[];

    constructor(id: string) {
        this._id = id;
        this._modal = document.querySelector(`${id}`);

        if (this._modal) {
            
            // this.sourceLanguage = this.languageQuerySelector(`.source-language`);
            this.sourceLanguage = new LanguageInput(this.nullCheckedQuerySelector(`.source-language`))
            this.targetLanguage = new LanguageInput(this.nullCheckedQuerySelector(`.translation-language`))

            this.submitButton = this.nullCheckedButtonQuerySelector(`.submit`);

            this.targetLanguage.addSibling(this.sourceLanguage);
            this.sourceLanguage.addSibling(this.targetLanguage);
              
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

    public get languageInputs() {
        return this._languageInputs;
    }

    protected get modal() {
        return this._modal;
    }

    protected updateInputValue(input: HTMLInputElement, value: string) {
        input.value = value;
        input.dispatchEvent(new Event('change'));   
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

    nullCheckedQuerySelector(selector: string): HTMLInputElement{
        const element: HTMLInputElement = this.modal?.querySelector(selector);
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
        } else {
            throw new Error(`Cannot find ${selector} in ${this._id}`);
        }
        
    }

    public openModal() {
        if (this.modal) this.modal.classList.toggle("is-active");
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

    // abstract validateForSubmit(): void;

}



abstract class CardModal extends Modal {

    // protected recorder;
    protected sourceWord: WordInput;
    protected translations: WordInput[] = [];
    // protected translations = { "inputs": [],  "values": []};
    
    // protected translations: NodeListOf<HTMLInputElement>;

    constructor(id: string) {
        super(id);
        this.buildTranslationInputList();
        

        // if modal not found, base will throw errors
        if (this.modal) {

            this.sourceWord = new WordInput(this.nullCheckedQuerySelector(`.source`));
            this.nullCheckedQuerySelectorAll(`.translation`).forEach(inputElement => this.translations.push(new WordInput(inputElement)))

            // every translation word input gets every other translation word input added as a sibling
            this.translations.forEach(wordInput => wordInput.addSiblings(this.translations));
            // this.translations.forEach(wordInput => {
            //     this.translations.forEach(wordInputInner => {
            //         if (wordInput != wordInputInner) wordInput.addSibling(wordInputInner);
            //     })
            //     }
            // );


            // const recorderDiv = this.modalQuerySelector(`.recorder`);
            // this.recorder = new Recorder(recorderDiv);
 
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
        console.log("working 1")
        const translationinputs = this.nullCheckedQuerySelectorAll(".translation");
        if (translationinputs) translationinputs.forEach(element => {
            
            const addButton = element.parentElement.querySelector(".add-translation");
            console.log(addButton)
            const template: HTMLTemplateElement | null = document.querySelector('.translation-template');
            addButton.addEventListener('click', (e) => {
                console.log("working 2.5")
                if (template && 'content' in document.createElement('template')) {
                    console.log("working 3")
                    // const clicked = e.target as HTMLElement;
                    // const translationsBlock = clicked?.parentElement?.parentElement?.parentElement?.parentElement;
                    // const translationsBlock: HTMLTemplateElement | null = this.modal!.querySelector('.translation-block');
                    const translationsBlock: nullableHTMLInputElement = this.nullCheckedQuerySelector('.translations-block')
                    if (translationsBlock) {
                        console.log("working 4")
                        const clone = (template.content.cloneNode(true) as HTMLDivElement);
                        translationsBlock.appendChild(clone);
                        const newTranslation: HTMLInputElement  = this.modal.querySelector(".translations-block").lastElementChild.querySelector(".translation") as HTMLInputElement
                        console.log(this.modal.querySelector(".translations-block"));
                        console.log(newTranslation);

                        const newWordInput = new WordInput(newTranslation);
                        newWordInput.addSiblings(this.translations);
                        this.translations.forEach(wordInput => wordInput.addSibling(newWordInput));
                        this.translations.push(newWordInput);
                        

                        const removeButton = clone.querySelector(".remove-translation");
                        if (removeButton) {
                            console.log("working 5")
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

}

class CreateDeckModal extends CardModal {

    private deck: BaseCard[];

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

    private card: BaseCard;

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
        // this.count = this.modalQuerySelector(".count");
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