type LanguagePair = {
    "source": string;
    "target": string;
}


type ServerCard = {
    id: string,
    source_word: string,
    translations: number,
    difficulty: string
}

const deckUpdated = new CustomEvent('deckUpdated');

function logError(message: string) {
    if (LOGGING) console.error(message);
}

function logInfo(message: string) {
    if (LOGGING) console.info(message);
}

function nullCheckedQuerySelector(containingDiv: HTMLDivElement | null, selector: string): HTMLInputElement | undefined {
    if (containingDiv) {
        const element: HTMLInputElement | null = containingDiv.querySelector(selector);
        if (element) {
            return element;
        }
        throw new Error(`Cannot find ${selector} in ${containingDiv.id}`);
    }
    else throw new Error(`Cannot find modal`);
}

function addClickEventToSelector(containingDiv: HTMLDivElement | null, selector: string, callback: ()=> void ): void {
    if (containingDiv) {
        const button: HTMLButtonElement | null = containingDiv.querySelector(selector);
        if (button) {
            button.addEventListener('click', () => callback() );
        }
        else logError(`Could not assign 'click' to ${selector} in ${containingDiv.id}`);
    }
    else logError(`Could not find ${containingDiv}.`);
}



// function addClickEventToSelector(selector: string, callback: ()=> void ): void {
//     const button: HTMLButtonElement | null | undefined = this.modal.querySelector(selector);
//     if (button) {
//         button.addEventListener('click', () => { callback() });
//     }
//     if (LOGGING) console.error(`Could not assign 'click' to ${selector}`);
//     // failedFunctionError(`Could not assign 'click' to ${selector} in ${this.id}`);
// }

// function addClickEventToSelectorAll(selector: string, callback: ()=> void ): void {
//     const elements: NodeListOf<HTMLButtonElement> | undefined = this.modal?.querySelectorAll(selector);
//     if (elements && elements.length > 0) {
//         elements.forEach(element => {
//             element.addEventListener('click', () => { callback() });
//         });
//     }
//     if (LOGGING) console.error(`Could not assign 'click' to ${selector}`);
// }