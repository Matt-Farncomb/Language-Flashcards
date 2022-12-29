


class Ui {
    
    editModal: EditCardModal;
    createDeckModal: CreateDeckModal;
    fetchDeckModal: FetchDeckModal;
    fetchTableModal: FetchTableModal;

    currentLanguages: LanguagePair;

    currentCard: PlayingCard | undefined;
    deck: Deck | undefined;
    front: HTMLSpanElement;
    back: HTMLSpanElement;

    nextCard: HTMLAnchorElement;
    edit: HTMLAnchorElement;
    clear: HTMLButtonElement;
    play: HTMLButtonElement;
    flip: NodeListOf<HTMLButtonElement>;

    clip: HTMLAudioElement | undefined;

    constructor() {
        
        this.fetchDeckModal = new FetchDeckModal("#draw-deck-modal");
        this.fetchTableModal = new FetchTableModal("#choose-language-modal");
        this.editModal = new EditCardModal("#edit-card-modal");
        this.createDeckModal = new CreateDeckModal("#create-deck-modal");

        const user = localStorage.getItem('current_user');
        const nextCardButton: HTMLAnchorElement | null = document.querySelector(".begin");
        const editButton: HTMLAnchorElement | null = document.querySelector(".edit");
        const clearButton: HTMLButtonElement | null = document.querySelector(".clear-deck");
        const playButton: HTMLButtonElement | null = document.querySelector(".play");
        const flipButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".flip");
        const front: HTMLSpanElement | null = document.querySelector(".front .card-content span");
        const back: HTMLSpanElement | null = document.querySelector(".back .card-content span");

        if (nextCardButton && editButton && clearButton && front && back && editButton && playButton  && flipButtons.length > 0) {
            this.deck = new Deck();
            this.deck.load();
            this.front = front;
            this.back = back;
            this.nextCard = nextCardButton;
            this.edit = editButton;
            this.clear = clearButton;
            this.play = playButton;
            this.flip = flipButtons;

            this.clear.onclick = () => {
                StoredDeck.clear(); 
            }

            this.nextCard.onclick = () => {
                this.begin();
            }

            this.play.onclick = () => {
                this.playClip();
            }

            this.flip.forEach(element => {
                element.onclick = () => this.flipCard(2);
            })

            if (!this.deck.loaded) {
                this.nextCard.classList.add("disabledPointer");
            } 

            addEventListener('deckUpdated', () => { 
                this.deck?.load();
                this.nextCard?.classList.remove("disabledPointer");
                this.nextCard.onclick = () => {
                    this.begin();
                }
            });

            addEventListener('deckCleared', () => { 
                this.nextCard?.classList.add("disabledPointer");
                this.unloadCard();
                this.deck?.clear();
            });

        } else {
            throw logError("Could not create UI");
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

    // draw a card and display its data
    // update UI to show the game has not started
    begin() {
        const topCard = this.deck?.drawCard();
        if (topCard) {
            this.loadCard(topCard); // update card UI to show card info of "topCard"
            this.nextCard.innerHTML = "Next";
            this.edit.classList.remove("disabledPointer");
            this.nextCard.onclick = () => this.next(); // the next button will now call "next()" instead of "begin()"
        }       
    }

    addClickEventToSelector(selector: string, callback: ()=> void ): void {
        const button: HTMLButtonElement | null = document.querySelector(selector);
        if (button) {
            button.addEventListener('click', () => { callback() });
        }
        else if (LOGGING) console.error(`Could not assign 'click' to ${selector}`);
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
        console.log("fart next");
        const nextCard = this.deck?.drawCard();
        if (nextCard) {
            this.loadCard(nextCard);
        }
    }

    public shuffle() {

    }

    // Update card UI to display playingCard data
    public async loadCard(playingCard: PlayingCard): Promise<void> {
        this.currentCard = playingCard;
        console.log(this.currentCard);
        this.front.innerHTML = this.currentCard.sourceWord;
        this.back.innerHTML = "";
        const ul = document.createElement("ul");
        this.currentCard.translations.forEach((element: any) => {
            const li = document.createElement("li");
            li.innerHTML = element.word;
            ul.appendChild(li);
        } )
        this.back.appendChild(ul);
        this.play.classList.remove("is-hidden");

        const fetchedAudio: Response = await fetch(`data:audio/ogg;base64,${this.currentCard.audio}`);
        const audioURL: string = window.URL.createObjectURL(await fetchedAudio.blob());

        this.clip = new Audio();
        this.clip.src = audioURL;
    }

    // Update card UI to display no data
    public unloadCard() {
        this.front.innerHTML = "";
        this.edit.classList.add("disabledPointer");
        this.play.classList.add("is-hidden");
    }

    private playClip() {
        this.clip?.play();
    }

    private flipCard(time: number) {
        console.log("flipping");
        const innerCard: HTMLElement | null = document.querySelector(".flip-card-inner");
        if (innerCard) {
            innerCard.style.transition = `${time}s`;
            innerCard.classList.toggle("flip");
        }
        
    }

    // #flipOverCard(time) {
       
    // }

    // #slowFlip() {
    //     this.#flipOverCard(2);
    // }

    // private getDeck(): PlayingCard[] | undefined {  
    //     // const json: string | null = localStorage.getItem("deck");
    //     // if (json && json != "{}") {

    //     //     const localDeck: Record<string, any>[] = JSON.parse(json);
    //     //     return localDeck.map(element => new PlayingCard(
    //     //         element["id"],
    //     //         element["source_word"],
    //     //         element["translations"],
    //     //         element["source_language"],
    //     //         element["target_language"],
    //     //         element["audio"],
    //     //         ) );  
                 
    //     // }
}
