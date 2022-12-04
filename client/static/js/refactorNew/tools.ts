type LanguagePair = {
    "source": string;
    "target": string;
}

function logError(message: string) {
    if (LOGGING) console.error(message);
}

function addClickEventToSelector(selector: string, callback: ()=> void ): void {
    const button: HTMLButtonElement | null | undefined = this.modal.querySelector(selector);
    if (button) {
        button.addEventListener('click', () => { callback() });
    }
    if (LOGGING) console.error(`Could not assign 'click' to ${selector}`);
    // failedFunctionError(`Could not assign 'click' to ${selector} in ${this.id}`);
}

function addClickEventToSelectorAll(selector: string, callback: ()=> void ): void {
    const elements: NodeListOf<HTMLButtonElement> | undefined = this.modal?.querySelectorAll(selector);
    if (elements && elements.length > 0) {
        elements.forEach(element => {
            element.addEventListener('click', () => { callback() });
        });
    }
    if (LOGGING) console.error(`Could not assign 'click' to ${selector}`);
}