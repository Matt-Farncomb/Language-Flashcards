

// type nullableHTMLInputElement = HTMLInputElement | null | undefined;
type nullableHTMLInputElement = HTMLInputElement | null | undefined;

abstract class Modal {

    // my logic: for class fields, throw error when fail making the modal not get created because it means something is named wrong or missing.
    // also, other child classes will reference them, so shoulf just totally fail earlier to avoid issues
    // for class methods, only console.error() so it makes further investigation easier
    // also, it makes testing other features easier if many methods are not implemented/not working

    protected id: string;
    protected modal: HTMLDivElement | null;
    protected sourceLanguage: HTMLInputElement;
    protected targetLanguage: HTMLInputElement;

    constructor(id: string) {
        this.id = id;
        this.modal = document.querySelector(`${id}`);


        if (this.modal) {
            // const sourceLanguage: nullableHTMLInputElement = this.modal.querySelector(`.source-language`);
            // const targetLanguage: nullableHTMLInputElement = this.modal.querySelector(`.target-language`);
            // const closeButtons: NodeListOf<HTMLButtonElement> = this.modal.querySelectorAll(`.close`);

            this.sourceLanguage = this.nullCheckedQuerySelector(`.source-language`);
            this.targetLanguage = this.nullCheckedQuerySelector(`.target-language`);

            addClickEventToSelector(".submit", this.submit);
            addClickEventToSelector(".clear", this.clear);
            addClickEventToSelectorAll(".close", this.closeModal);

            // if (closeButtons.length > 0) {
            //     closeButtons.forEach(element => {
            //         element.addEventListener('click', () => {
            //             this.closeModal();
            //         })
            //     })
            // } else {
            //     elementNotFoundInModalError(id, "close");
            // }



            // const submit: HTMLButtonElement | null = this.modal.querySelector(`.submit`);
            // const clear: HTMLButtonElement | null = this.modal.querySelector(`.clear`);



            // const testButtons = this.emptyCheckedQuerySelector(`.close`) as NodeListOf<HTMLButtonElement>;

            // this.isElementNull(sourceLanguage, "modal");
            // this.sourceLanguage = sourceLanguage;


            // if (targetLanguage) {
            //     this.targetLanguage = targetLanguage;
            // } else {
            //     elementNotFoundInModalError("targetLanguage", id);
            // }



            // if (submit) {
            //     submit.addEventListener('click', () => { this.submit(); })
            // } else {
            //     elementNotFoundInModalError(id, "submit");
            // }

            // if (clear) {
            //     clear.addEventListener('click', () => { this.clear(); })
            // } else {
            //     elementNotFoundInModalError(id, "clear");
            // }
        }
        else {
            throw Error(`${this.id} modal cannot be found`);
        }

    }

    nullCheckedQuerySelector(selector: string): HTMLInputElement {
        const element: nullableHTMLInputElement = this.modal?.querySelector(selector);
        if (element) {
            return element;
        }
        throw new Error(`Cannot find ${selector} in ${this.id}`);
    }

    nullCheckedQuerySelectorAll(selector: string): NodeListOf<HTMLInputElement> {
        const elements: NodeListOf<HTMLInputElement> | undefined = this.modal?.querySelectorAll(selector);
        if (elements && elements.length > 0) {
            return elements;
        }
        throw new Error(`Cannot find ${selector} in ${this.id}`);
    }

    // addClickEventToSelector(selector: string, callback: ()=> void ): void {
    //     const button: HTMLButtonElement | null | undefined = this.modal?.querySelector(selector);
    //     if (button) {
    //         button.addEventListener('click', () => { callback() });
    //     }
    //     failedFunctionError(`Could not assign 'click' to ${selector} in ${this.id}`)
    //     // throw new Error(`Cannot find ${selector} in ${this.id}`);
    // }

    // addClickEventToSelectorAll(selector: string, callback: ()=> void ): void {
    //     const elements: NodeListOf<HTMLButtonElement> | undefined = this.modal?.querySelectorAll(selector);
    //     if (elements && elements.length > 0) {
    //         elements.forEach(element => {
    //             element.addEventListener('click', () => { callback() });
    //         });
    //     }
    //     console.error(`Could not assign 'click' to ${selector} in ${this.id}`)
    //     // throw new Error(`Cannot find ${selector} in ${this.id}`);
    // }

    // isElementNull(element: HTMLElement | null, elementString: string): asserts element {
    //     if (!element) {
    //         throw new Error(`Cannot find${elementString} in ${this.id}`);
    //     }
    // }

    openModal() {
        if (this.modal) this.modal.classList.toggle("is-active");
    }

    closeModal() {
        if (this.modal) this.modal.classList.toggle("is-active");
    }

    // Check if language is in validLangauges list
    validateLanguage(language: string) {
       if (language in Serverr.validLangauges) {
        // style good
       } else {
        // style bad
       }
    }

    validateLanguages() {
        if (this.sourceLanguage) {
            this.validateLanguage(this.sourceLanguage.value);
        } else {
            logError("Cannot validate source language");
        }
        if (this.targetLanguage) {
            this.validateLanguage(this.targetLanguage.value);
        } else {
            logError("Cannot validate target language");
        }
    }

    clear() {
        if (this.modal) {
            const inputs: NodeListOf<HTMLInputElement> = this.modal.querySelectorAll(".input");
            if (inputs.length > 0) {
                inputs.forEach(element => {
                    element.value = "";
                })
            } else {
                elementNotFoundInModalError("input", this.id);
            }
        }

    }

    abstract submit(): void;

}

abstract class CardModal extends Modal {

    protected recorder;
    protected sourceWord: nullableHTMLInputElement;
    protected translations: NodeListOf<HTMLInputElement>;
    // protected translations = { "inputs": [],  "values": []};
    
    // protected translations: NodeListOf<HTMLInputElement>;

    constructor(id: string) {
        super(id);
        this.recorder = new Recorder();

        // if modal not found, base will throw errors
        if (this.modal) {

            // const sourceWord: nullableHTMLInputElement = this.modal.querySelector(`.source-language`);

            this.sourceWord = this.nullCheckedQuerySelector(`.source`);
            this.translations = this.nullCheckedQuerySelectorAll(`.translation`);

            // const translations: NodeListOf<HTMLInputElement> = this.modal.querySelectorAll(`.translation`);
            // if (sourceWord) {
            //     this.sourceWord = sourceWord;
            // } else {
            //     elementNotFoundInModalError("sourceWord", id);
            // }

            // if (translations.length > 0) {
            //     this.translations = translations;
            // } else {
            //     elementNotFoundInModalError("translations", id);
            // }

        }
    }

    validateWord(word: string) {}

    translationValues() {
        const values: string[] = [];
        this.translations.forEach(element => values.push(element.value));
        return values;
    }

    validateWords() {

        if (this.sourceWord) {
            this.validateWord(this.sourceWord.value)
        } else {
            elementNotFoundInModalError("sourceWord", this.id)
        }

        if (this.translations) {
            this.translations.forEach(element => {
                this.validateWord(element.value);
            })
        }

    }


}

class CreateCardModal extends CardModal {

    private deck: UploadCard[];

    constructor(id: string) {
        super(id);

        if (this.modal) {

            // const addCard: nullableHTMLInputElement = this.modal.querySelector(`.add-card`);

            addClickEventToSelector(`.add-card`,  this.addCardToDeck);

            // if (addCard) {
            //     addCard.addEventListener('click', () => {
            //         this.addCardToDeck();
            //     })
            // }
        }

    }


    addCardToDeck() {
        if (this.sourceWord) {
            const card = new UploadCard(this.id, this.sourceWord.value, this.translationValues(), this.sourceLanguage.value, this.targetLanguage.value, this.recorder.clip);
            this.deck.push(card);
            this.clear();
        }
    }

    submit() {

    //     if (this.sourceLanguage && this.targetLanguage) {
    //         const url = `${"SERVER"}\\${"url"}\\`;
    //         const formData = new FormData();

    //         this.deck.forEach(card => {
    //             formData.append("source_word", card.sourceWord)
    //             formData.append("translations", card.translations);
    //             formData.append("file", card.audio, card.sourceWord); // file and filename
    //         });
    //         // used optional chaining here because no chance of sourceLanguage being null because you can't even call submit if its nulll
    //         formData.append("source_language", JSON.stringify([this.sourceLanguage.value]))
    //         formData.append("target_language", JSON.stringify([this.targetLanguage.value]))

    //         fetch(url, {method: 'POST', body: formData});

    //     } else {
    //         submitError("sourceLanguage", "targetLanguage");
    //     }
    // }
}

class EditCardModal extends CardModal {

    private card: Card;

    constructor(id) {
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
                        elementNotFoundInModalError("translation-block", this.id);
                    }

                } else {
                    console.log("Cant't add");
                }
            })
        })
    }
    // tTODO: takes only language pair or null so some modals can just not use the argument
    openModal(): void {
        // if (!(card instanceof Card)) {
        //     throw TypeError("Opening an edit Modal requires argument of type Card");
        // }
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

    populateCard(card) {
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
        Serverr.postEdit(this.card);
    }
}

class FetchDeckModal extends CardModal {

    constructor(id: string) {
        super(id);
       
    }

    submit(): void {
        this.fetchDeck();
    }

    fetchDeck() {
        // const json:Response = await fetch();
        // const serializedDeck = deck.map( element => element.serialiseData() )
        localStorage.setItem("deck", JSON.stringify(serializedDeck));
    }

}

class FetchTableModal extends Modal {

    submit(): void {
        this.fetchLibrary();
    }

    fetchLibrary() {
        // open up library table
    }
}