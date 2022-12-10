

abstract class ExtendedInput {
    
    protected _htmlElement: HTMLInputElement;
    protected _siblings: ExtendedInput[];

    constructor(input: HTMLInputElement) {
        this._htmlElement = input;
        this._siblings = [];
        this._htmlElement.oninput = () => this.validate();
        this._htmlElement.onchange = () => this.checkIfUnique();
    }

    public get value() {
        return this._htmlElement.value;
    }

    public set value(value) {
        this._htmlElement.value = value
    }

    // Siblings are used to ensure that they can't have the same value as each other
    public addSiblings(sibling: ExtendedInput) {
        this._siblings.push(sibling);
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

    styleValid() {
        if (!this.isEmpty()) {
            this._htmlElement.classList.add("is-primary");
            this._htmlElement.classList.remove("is-danger");
        } else {
            this._htmlElement.classList.remove("is-danger","is-primary");
        }
    }

    styleInvalid() {
        if (!this.isEmpty()) {
            this._htmlElement.classList.add("is-danger");
            this._htmlElement.classList.remove("is-primary");
        } else {
            this._htmlElement.classList.remove("is-danger","is-primary");
        }
    }

    protected checkIfUnique() {
        if (this._siblings.length > 0) {
            for (let sibling of this._siblings) {
                if (sibling.value == this.value) {
                    this.styleInvalid();
                    sibling.styleInvalid();
                } else if (sibling.value != this.value){
                    this.validate();
                    sibling.validate();
                }
            }
        } 
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