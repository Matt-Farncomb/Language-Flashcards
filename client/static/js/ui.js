
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

    constructor(deck, server, deckSize) {
        this.#loggedIn = this.#loggedInFunc();
        this.#deck = deck;
        this.#server = server;
        this.#deckSize = deckSize;
        this.#baseDeck = null;
        this.#currentCustomCard = null;

        document.querySelector("#user-sl").innerText = localStorage.getItem('source_language', 'lang');
        document.querySelector("#user-tl").innerText = localStorage.getItem('target_language', 'lang');
     
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
        this.#whenClicked(".close-create-modal", () => this.#revealCardForm());
        this.#whenClicked("#clear", () => this.#clearCardForm());
        this.#whenClicked("#upload", () => this.#server.uploadDeck(this.#baseDeck));
        this.#whenClicked("#add", () => this.#getCardForUpload());

        this.#validateLanguageOnChange('source');
        this.#validateLanguageOnChange('translation');
        this.#validateWordOnChange('source');
        this.#validateWordOnChange('translation');

        this.#validateDrawCardLanguageOnChange("source");
        this.#validateDrawCardLanguageOnChange("translation");
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

    async #readyToDraw() {
        const data = await this.#server.languages
        const scource = document.querySelector("source-language").value;
        
        return data.includes(scource) && data.includes(translation)     
    }

    #disableAddCard() {
        document.querySelector("#add").classList.add("disabledPointer");    
        document.querySelector("#add").classList.remove("is-success");
        if (this.#baseDeck == null) {
            document.querySelector("#upload").classList.add("disabledPointer");
        } 
    }

    #enableAddCard() {
        document.querySelector("#upload").classList.remove("disabledPointer");
        document.querySelector("#add").classList.remove("disabledPointer"); 
        document.querySelector("#add").classList.add("is-success");
    }

    
    
    //Oh god, what an awfull function - MUST REFACTOR ASAP
    // TODO: When clicking on draw deck, the form is empty but still NOT greyed out
    async #validateDrawCardLanguageOnChange(languageType) {
        const inputs = {
            "source": false,
            "translation": false
        }
        const data = await this.#server.languages;
        const selector = document.querySelector(`#${languageType}-language`);
        selector.onchange = (e) => {
            const source = document.querySelector("#source-language").value;
            const translation = document.querySelector("#translation-language").value;
            inputs["source"] = data.includes(source);
            inputs["translation"] = data.includes(translation);
            if (inputs["source"] && inputs["translation"] && source != translation) {
                document.querySelector("#draw-deck").classList.remove("disabledPointer"); 
                document.querySelector("#draw-deck").classList.add("is-success");
            } else {
                document.querySelector("#draw-deck").classList.add("disabledPointer"); 
                document.querySelector("#draw-deck").classList.remove("is-success");
            }

            if (inputs[languageType]){
                selector.classList.add("is-primary");
                selector.classList.remove("is-danger");
            } else if (!inputs[languageType] && selector.value != "") {
                selector.classList.remove("is-primary");
                selector.classList.add("is-danger");
            }

            if (inputs[languageType] && source != translation) {
                document.querySelector("#source-language").classList.add("is-primary");
                document.querySelector("#translation-language").classList.add("is-primary")
                document.querySelector("#source-language").classList.remove("is-danger")
                document.querySelector("#translation-language").classList.remove("is-danger")
            }
            else {
                document.querySelector("#source-language").classList.remove("is-primary");
                document.querySelector("#translation-language").classList.remove("is-primary");
                document.querySelector("#source-language").classList.add("is-danger")
                document.querySelector("#translation-language").classList.add("is-danger");
            }
               
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
        this.#baseDeck = null;
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

        const card = new BaseCard(this.#currentCustomCard.word, this.#currentCustomCard.translation);
        console.log(card);
        this.#baseDeck.addCard(card);
        this.#clearWords();
    }


    login(event) {
        // event.preventDefault();
        let source_language = document.querySelector("#source-language");
        let target_language = document.querySelector("#translation-language");
        localStorage.setItem('source_language', source_language.value);
        localStorage.setItem('target_language', target_language.value);
        this.#updateDisplayedLanguages();
        this.#newDeck();
        // this.reveal();
    }

    #revealDeckForm() {
        document.querySelector("#deck-modal").classList.toggle("is-active");
    }

    #revealCardForm() {
        
        // if (this.#baseDeck != null) console.log(this.#baseDeck);
        this.#currentCustomCard = new CustomCard(this.#server);
        //this.#readyToUpload();
        this.#disableAddCard();
        document.querySelector("#new-card-modal").classList.toggle("is-active");
        this.#clearCardForm();
        
    }

    #updateDisplayedLanguages() {
        document.querySelector("#user-sl").innerText = localStorage.getItem('source_language', 'lang');
        document.querySelector("#user-tl").innerText = localStorage.getItem('target_language', 'lang');
    }

    #whenClicked(id, func) {
        const button = document.querySelectorAll(`${id}`);
        button.forEach(element => {
            element.addEventListener('click', () => { 
                func()
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