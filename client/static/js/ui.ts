


class Ui {
    
    editModal: EditCardModal;
    createDeckModal: CreateDeckModal;
    fetchDeckModal: FetchDeckModal;
    fetchTableModal: FetchTableModal;

    currentLanguages: LanguagePair;

    currentCard: PlayingCard | undefined;
    deck: PlayingCard[] | undefined;

    begin: HTMLAnchorElement | undefined;
    edit: HTMLAnchorElement | undefined;
    clear: HTMLButtonElement | undefined;

    constructor() {
        
        this.fetchDeckModal = new FetchDeckModal("#draw-deck-modal");
        this.fetchTableModal = new FetchTableModal("#choose-language-modal");
        this.editModal = new EditCardModal("#edit-card-modal");
        this.createDeckModal = new CreateDeckModal("#create-deck-modal");

        const previousDeck = this.getDeck();
        const user = localStorage.getItem('current_user');
        const beginButton: HTMLAnchorElement | null = document.querySelector(".begin");
        const editButton: HTMLAnchorElement | null = document.querySelector(".edit");
        const clearButton: HTMLButtonElement | null = document.querySelector(".clear-deck");

        
        if (beginButton && editButton && clearButton) {
            this.begin = beginButton;
            this.clear = clearButton;
            this.clear.onclick = () => {
                DeckStorage.clear(); 
                window.dispatchEvent(new Event("deckUpdated"));
            }

            if (previousDeck) {
                this.deck = previousDeck;
            } else {
                this.begin.classList.add("disabledPointer");
            }

            addEventListener('deckUpdated', () => { 
                console.log("update");
                this.deck = this.getDeck();
                if (!this.deck) {
                    this.begin?.classList.add("disabledPointer");
                } else {
                    this.begin?.classList.remove("disabledPointer");
                }
            });
        }


        this.addClickEventToSelector("#open-edit-card-modal", () => {
            if (this.currentCard) {
                this.editModal.populateCard(this.currentCard);
                this.editModal.openModal();
                }
            }
        );

        this.addClickEventToSelector("#open-create-deck-modal", () => {
            this.createDeckModal.openModal()
            }
        );

        this.addClickEventToSelector("#open-fetch-deck-modal", () => {
            this.fetchDeckModal.openModal()
            }
        );

        this.addClickEventToSelector("#open-fetch-table-modal", () => {
            this.fetchTableModal.openModal()
            }
        );
        
        // if user has logged in, get the languages
        if (user) {
            const currentSourceLanguage: string | null  = localStorage.getItem('source_language');
            const currentTargetLanguage: string | null  = localStorage.getItem('target_language');

            if (currentSourceLanguage && currentTargetLanguage) {
                const currentLanguages: LanguagePair = { "source": currentSourceLanguage, "target": currentTargetLanguage }
                this.currentLanguages = currentLanguages;
            }
            else {
                this.currentLanguages = DEFAULT_LANGUAGES;
            }
        } else {
            // user has not logged in so create demo user. TODO: Launch user LogIn Model
            localStorage.setItem("user", "demo");
            localStorage.setItem("source_language", DEFAULT_LANGUAGES.source);
            localStorage.setItem("target_language", DEFAULT_LANGUAGES.target);

            this.currentLanguages = DEFAULT_LANGUAGES;
        }
     }

    addClickEventToSelector(selector: string, callback: ()=> void ): void {
        const button: HTMLButtonElement | null = document.querySelector(selector);
        if (button) {
            button.addEventListener('click', () => { callback() });
        }
        else if (LOGGING) console.error(`Could not assign 'click' to ${selector}`);
        // failedFunctionError(`Could not assign 'click' to ${selector} in ${this.id}`);
    }

    addClickEventToSelectorAll(selector: string, callback: ()=> void ): void {
        const elements: NodeListOf<HTMLButtonElement> | undefined = document.querySelectorAll(selector);
        if (elements && elements.length > 0) {
            elements.forEach(element => {
                element.addEventListener('click', () => { callback() });
            });
        }
        else if (LOGGING) console.error(`Could not assign 'click' to ${selector}`);
    }


    public next() {

    }

    public shuffle() {

    }

    private getDeck(): PlayingCard[] | undefined {  
        const json: string | null = localStorage.getItem("deck");
        if (json && json != "{}") {

            const localDeck: Record<string, any>[] = JSON.parse(json);
            return localDeck.map(element => new PlayingCard(
                element["id"],
                element["source_word"],
                element["translations"],
                element["source_language"],
                element["target_language"],
                element["audio"],
                ) );  
                 
        }
    }
}