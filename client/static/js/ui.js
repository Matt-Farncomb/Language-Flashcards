
class UI {

    #deck;
    #front;
    #back;
    #card;
    #baseDeck;

    #loggedIn;
    #server;
    #deckSize;

    #currentCustomCard;
    #deckToDraw;
    #audio;

    constructor(deck, server, deckSize) {
        this.#loggedIn = this.#loggedInFunc();
        this.#deck = deck;
        this.#server = server;
        this.#deckSize = deckSize;
        this.#baseDeck = null;
        this.#currentCustomCard = null;
        this.#deckToDraw = null;
        this.#audio = new Audio();

        document.querySelector("#user-sl").innerText = localStorage.getItem('source_language', 'lang');
        document.querySelector("#user-tl").innerText = localStorage.getItem('target_language', 'lang'); 
        document.querySelector("nav div a").href = `/table?source_language=${localStorage.getItem("source_language", "lang")}`
        console.log(document.querySelector("nav div a").href);
     
        //Server Cards
        this.#whenClicked("#draw-deck", () => this.login());
        this.#whenClicked("#new-deck", () => this.#revealDeckForm());
        this.#whenClicked(".close-deck-modal", () => this.#revealDeckForm());
        this.#whenClicked("#front-flip", () => this.#flipOverCard());
        this.#whenClicked("#back-flip", () => this.#flipOverCard());
        this.#whenClicked("#new-card", () => this.#drawCard()); 
        this.#whenClicked("#logout", () => this.logout());    
        this.#whenClicked("#submit-result", () => this.#server.submitResult(this.#deck));  
        this.#whenClicked("#update-server", () => this.#server.refresh());
        this.#whenClicked("#submit-answer", () => this.#checkAnswer()); 
        //Creating new cards
        this.#whenClicked("#create", () => this.#revealCardForm());
        this.#whenClicked(".close-create-modal", () => this.#hideHardForm() );
        this.#whenClicked("#clear", () => this.#clearCardForm());
        this.#whenClicked("#upload", () => this.#server.uploadDeck(this.#baseDeck));
        this.#whenClicked("#add", () => this.#getCardForUpload());

        this.#whenClicked("#play-word", () => this.playAudio());

        this.#toggleWhenClicked(".toggle-is-light");

        this.#validateLanguageOnChange('source');
        this.#validateLanguageOnChange('translation');
        this.#validateWordOnChange('source');
        this.#validateWordOnChange('translation');

        this.#validateDrawCardOnChange("deck-size");
        this.#validateDrawCardOnChange("source-language");
        this.#validateDrawCardOnChange("translation-language");
    }

    async playAudio() {
        // this.#audio.src = await this.#card.audio;
        this.#audio.src = await this.#card.audio;
        this.#audio.play();
    }

    async #readyToUpload() {
        const test = await this.#currentCustomCard.readyToUpload(this.#deck);
        console.log(test);
        if (test) {
            this.#enableAddCard();
        } else {
            this.#disableAddCard();
        }
    }

    async #readyToDraw() {
        const test = await this.#deckToDraw.readyToDraw();
        console.log(test);
        if (test) {
            document.querySelector("#draw-deck").classList.remove("disabledPointer"); 
            document.querySelector("#draw-deck").classList.add("is-success");
        } else {
            document.querySelector("#draw-deck").classList.add("disabledPointer"); 
            document.querySelector("#draw-deck").classList.remove("is-success");
        }
    }

    #toggleIsLight(buttons){
        buttons.forEach(element => {
            element.classList.toggle("is-light");
        });
    }

    #changeInputUIIfInvalid(languageType) {
        // const selector = document.querySelector(`${languageType}-language`);
        const validLanguage = data.includes(selector.value)
        if (validLanguage){
            selector.classList.add("is-primary");
            selector.classList.remove("is-danger");
        } else if (!validLanguage && selector.value != "") {
            selector.classList.remove("is-primary");
            selector.classList.add("is-danger");
        }
    }

    // async #readyToDraw() {
    //     const data = await this.#server.languages
    //     const scource = document.querySelector("source-language").value;
        
    //     return data.includes(scource) && data.includes(translation)     
    // }

    #disableAddCard() {
        document.querySelector("#add").classList.add("disabledPointer");    
        document.querySelector("#add").classList.remove("is-success");
        if (this.#baseDeck == null) {
            document.querySelector("#upload").classList.add("disabledPointer");
        } 
    }

    #enableAddCard() {
        document.querySelector("#add").classList.remove("disabledPointer"); 
        document.querySelector("#add").classList.add("is-success");
        if (this.#baseDeck != null) {
            document.querySelector("#upload").classList.remove("disabledPointer");
        }
    }

    
    

    async #validateDrawCardOnChange(input) {
        const selector = document.querySelector(`#${input}`);
        selector.onchange = (e) => {
            this.#readyToDraw();
        }
    }

    async #validateLanguageOnChange(id) {
        const input = document.querySelector(`#add-${id}-language`);
        input.onchange = (e) => {
            this.#currentCustomCard.isThisLanguageValid(id);
            this.#readyToUpload();
        }
    }

    #validateWordOnChange(id) {
        const input = document.querySelector(`#add-${id}`);
        input.onchange = (e) => {
            this.#currentCustomCard.wordIsReady(input);
            this.#readyToUpload();
        } 
        
    }

    #toggleLanguageLock(status) {
        document.querySelector("#add-source-language").disabled = status;
        document.querySelector("#add-translation-language").disabled = status;
    }

    #clearCardForm() {
        const inputs = document.querySelectorAll("#new-card-modal input");
        inputs.forEach(input => {
            input.value = "";
            input.classList.remove("is-primary", "is-danger");
        });
        this.#disableAddCard();
        this.#toggleLanguageLock(false);
        // this.#baseDeck = null;
    }

    #clearWords() {
        document.querySelector("#add-source").value = "";
        document.querySelector("#add-source").classList.remove("is-primary", "is-danger");
        document.querySelector("#add-translation").value = "";
        document.querySelector("#add-translation").classList.remove("is-primary", "is-danger");
        this.#readyToUpload();
    }

    #getCardForUpload() {
        
        if (this.#baseDeck == null) {
            
            this.#baseDeck = new BaseDeck(
                this.#currentCustomCard.sourceLanguage, this.#currentCustomCard.targetLanguage
            );
            this.#toggleLanguageLock(true);
        }
        console.log(this.#currentCustomCard.audio);
        const card = new BaseCard(this.#currentCustomCard.word, this.#currentCustomCard.translation, this.#currentCustomCard.audio);
        console.log(card);
        this.#baseDeck.addCard(card);
        this.#clearWords();
        if (this.#baseDeck != null)  {
            document.querySelector("#upload").classList.remove("disabledPointer");
        }

        
    }


    login(event) {
        console.log("fart");
        
        // event.preventDefault();
        let source_language = document.querySelector("#source-language");
        let target_language = document.querySelector("#translation-language");
        localStorage.setItem('source_language', source_language.value);
        localStorage.setItem('target_language', target_language.value);
        this.#updateDisplayedLanguages();
        this.#newDeck();
        // document.querySelector("#new-card").innerText = "Play";
        // this.reveal();
    }

    #revealDeckForm() {
        document.querySelector("#deck-modal").classList.toggle("is-active");
        this.#deckToDraw = new DrawDeck(this.#server);
    }

    #revealCardForm() {
        this.#baseDeck = null;
        // if (this.#baseDeck != null) console.log(this.#baseDeck);
        this.#currentCustomCard = new CustomCard(this.#server);
        //this.#readyToUpload();
        this.#disableAddCard();
        document.querySelector("#new-card-modal").classList.toggle("is-active");
        this.#clearCardForm();
        
    }

    #hideHardForm() {
        this.#disableAddCard();
        document.querySelector("#new-card-modal").classList.toggle("is-active");
        this.#clearCardForm();
    }

    #updateDisplayedLanguages() {
        document.querySelector("#user-sl").innerText = localStorage.getItem('source_language', 'lang');
        document.querySelector("#user-tl").innerText = localStorage.getItem('target_language', 'lang');
        // document.querySelector("nav div a").href = `/table/sl=${localStorage.getItem("source_language", "lang")}?tl=${localStorage.getItem("source_language", "lang")}`
    }

    #whenClicked(id, func) {
        const button = document.querySelectorAll(`${id}`);
        button.forEach(element => {
            element.addEventListener('click', () => { 
                func()
            } );
        });
    }

    #toggleWhenClicked(id) {
        const button = document.querySelectorAll(`${id}`);
        button.forEach(element => {
            element.addEventListener('click', () => { 
                this.#toggleIsLight(button);
            } );

        });
    }

    #toggleWrong() {
        const answer = document.querySelector("#answer");
        const answerButton = document.querySelector("#submit-answer");
        answer.classList.add("has-background-danger-light");
        answerButton.classList.add("has-background-danger");
    }

    #toggleCorrect() {
        const answer = document.querySelector("#answer");
        const answerButton = document.querySelector("#submit-answer");
        answer.classList.remove("has-background-danger-light");
        answerButton.classList.remove("has-background-danger");
    }

    #checkAnswer() {
       
        const answer = document.querySelector("#answer");
        const input = answer.value;
        if (this.#card.isCorrectTranslation(input)) {
            console.log("Correct");
            this.#toggleCorrect();
            // answer.classList.remove("has-background-danger-light");
            // answerButton.classList.remove("has-background-danger");
        } else {
             console.log("wrong"); 
             
             this.#toggleWrong();
            //  answer.classList.add("has-background-danger-light");
            //  answerButton.classList.add("has-background-danger");

        }
    }

    #flipOverCard() {
        const inner = document.querySelector(".flip-card-inner");
        inner.classList.toggle("flip");
    }

    #drawCard() {
        console.log("fart two")
        document.querySelector("#new-card").innerText = "Next";
        this.#card = this.#deck.randomCard();
        this.#front = this.#card.word;
        this.#back = this.#card.translations;
        this.#toggleCorrect();
        this.#updateDisplay();
    }


    // reveal() {
    //     if (this.#loggedInFunc()) {
    //         console.log("logged in")
    //         const deck = document.querySelector("#deck");
    //         deck.classList.remove("hidden");
    //     }
    // }

   
    #loggedInFunc() {
        if (localStorage.getItem('source_language', 'lang')) {
            return true;
        }
        else return false;
    }

    logout() {
        localStorage.removeItem("source_language");
        localStorage.removeItem("target_language");
        const deck = document.querySelector("#deck");
        deck.classList.add("hidden");
        this.#loggedIn = false;
    }

    #updateDisplay() {
        this.#updateFace();
        this.#updateBack()
    }

    #updateFace() {
        const front = document.querySelector(".flip-card-front .card-content span");
        front.textContent = this.#front.word;
    }

    #updateBack() {
        const back = document.querySelector(".flip-card-back .card-content span");
        back.innerHTML = "";
        if (this.#back.length == 0) {
            const li = document.createElement("li");
            li.innerText = "No translations available";
            back.appendChild(li);
        }
        else {
            this.#back.forEach(element => {
                const li = document.createElement("li");
                li.innerText = element.word;
                back.appendChild(li);
            });
        }
        
    }

    #newDeck() {
        const deckSize = document.querySelector("#deck-size").value;
        this.#deck.getDeck(this.#server, deckSize);
        document.querySelector("#new-card").disabled = false;
        document.querySelector("#new-card").classList.remove("disabledPointer");
    }

    #refreshServer() {
        this.#server.refreshServer();
    }

}