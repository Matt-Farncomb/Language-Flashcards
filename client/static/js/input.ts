

abstract class ExtendedInput {
    
    protected _htmlElement: HTMLInputElement;
    protected _siblings: ExtendedInput[];

    constructor(input: HTMLInputElement) {
        this._htmlElement = input;
        this._siblings = [];
        this._htmlElement.oninput = () => this.validate();
        // this._htmlElement.onchange = () => this.checkIfUnique();
    }

    public get value() {
        return this._htmlElement.value;
    }

    public set value(value) {
        this._htmlElement.value = value
    }

    public addOnChangeEvent(func: ()=> void): void {
        this._htmlElement.addEventListener('change', func);
    }

    // Siblings are used to ensure that they can't have the same value as each other
    public addSibling(sibling: ExtendedInput) {
        this._siblings.push(sibling);
    }

    public addSiblings(siblings: ExtendedInput[]) {
        siblings.forEach(sibling => {
            if (sibling != this) {
                this.addSibling(sibling)
            }
        })
    }

    public clearSiblings() {
        this._siblings = [];
    }

    public isEmpty() {
        return (this._htmlElement.value == "");
    }

    public abstract isValid(): Promise<boolean>;
       
    async validate() {
        if (await this.isValid()) {
            this.styleValid()
        } else {
            this.styleInvalid();
        } 
    }

    private styleValid() {
        if (!this.isEmpty()) {
            this._htmlElement.classList.add("is-primary");
            this._htmlElement.classList.remove("is-danger");
        } else {
            this._htmlElement.classList.remove("is-danger","is-primary");
        }
    }

    private styleInvalid() {
        if (!this.isEmpty()) {
            this._htmlElement.classList.add("is-danger");
            this._htmlElement.classList.remove("is-primary");
        } else {
            this._htmlElement.classList.remove("is-danger","is-primary");
        }
    }

    public removeFromDOM() {
        this._htmlElement.parentElement?.parentElement?.remove();
        this.clearSiblings();
    }

    // Check if any siblings (and this) have any duplicate values 
    // style appropriately if they do/don't
    protected checkIfUnique(): boolean {
        let unique = true;
        if (this._siblings.length > 0) {
            this._siblings.forEach((element: ExtendedInput) => {
                const invalid = element._siblings.filter(innerElement => element.value == innerElement.value);
                if (invalid.length == 0) {
                    element.validate();
                } else {
                    invalid.forEach(e => {
                        element.styleInvalid();
                        e.styleInvalid();
                        if (unique) unique = false;
                    })
                }
            });
        } 
        return unique;
    }

    public async isReady(): Promise<boolean> {
        const valid = await this.isValid();
        const unique = this.checkIfUnique();
        return valid && unique;
    }

}

class WordInput extends ExtendedInput {

    constructor(input: HTMLInputElement) {
        super(input);
    }

    public async isValid(): Promise<boolean> {
        return !(this._htmlElement.validity.patternMismatch || this.isEmpty());
    }
}

class LanguageInput extends ExtendedInput {

    constructor(input: HTMLInputElement) {
        super(input);
    }

    public async isValid(): Promise<boolean> {
        const awaitedLanguages = await Server.validLangauges;
        return awaitedLanguages.includes(this.value);
    }
}

class NumberInput extends ExtendedInput {

    constructor(input: HTMLInputElement) {
        super(input);
    }

    public async isValid(): Promise<boolean> {
        const number = parseInt(this.value);
        return number > 0 && number <= 10;
    }
}
