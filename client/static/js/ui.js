
class UI {

    #deck;
    #front;
    #back;
    #card;
    #baseDeck;

    #loggedIn;
    #server;
    #deckSize;

    constructor(deck, server, deckSize) {
        this.#loggedIn = this.#loggedInFunc();
        this.#deck = deck;
        this.#server = server;
        this.#deckSize = deckSize;
        this.#baseDeck = null;

        document.querySelector("#user-sl").innerText = localStorage.getItem('source_language', 'lang');
        document.querySelector("#user-tl").innerText = localStorage.getItem('target_language', 'lang');
        document.querySelector("#new-card").classList.add("disabledPointer");
        document.querySelector("#edit").classList.add("disabledPointer");


        // this.#whenClicked("#draw-deck", () => this.#newDeck());
        this.#whenClicked("#draw-deck", () => this.login());
        this.#whenClicked(".close-deck-modal", () => this.#revealDeckForm());
        this.#whenClicked("#new-deck", () => this.#revealDeckForm());

        this.#whenClicked("#create", () => this.#revealCardForm());
        this.#whenClicked(".close-create-modal", () => this.#revealCardForm());

        this.#whenClicked("#clear", () => this.#clearForm());

        this.#whenClicked("#upload", () => this.#server.uploadDeck(this.#baseDeck));

        this.#whenClicked("#add", () => this.#getCardForUpload());

        this.#whenClicked("#front-flip", () => this.#flipOverCard());
        this.#whenClicked("#back-flip", () => this.#flipOverCard());
        this.#whenClicked("#new-card", () => this.#drawCard()); 
        this.#whenClicked("#logout", () => this.logout());    
        this.#whenClicked("#submit-result", () => this.#server.submitResult(this.#deck));  
        this.#whenClicked("#update-server", () => this.#server.refresh());
        this.#whenClicked("#submit-answer", () => this.#checkAnswer()); 

        const chooseSrcLanguage = document.querySelector('#add-lang');
        const chooseTranLanguage = document.querySelector('#add-tran-lang');

        this.#validateLanguageInput(chooseSrcLanguage);
        this.#validateLanguageInput(chooseTranLanguage);

        // chooseLanguage.addEventListener('change', (event) => {
        //     console.log("fart");
        // });

        // document.querySelector("#answer").addEventListener('submit', (e) => {
        //     this.#checkAnswer();
        //  });

    }

    #validateLanguageInput(type) {
       
        const languages = document.querySelector("#languages").querySelectorAll("option");

        type.onchange = (e) => {
            console.log(languages);
            const input = e.target.value;
            if (nodeListContains(languages, input)) {
                type.classList.add("is-primary");
                type.classList.remove("is-danger");
                console.log("valid");
            } else {
                console.log("invalid");
                type.classList.add("is-danger");
                type.classList.remove("is-primary");
            }          
        }
    }

    #clearForm() {
        const inputs = document.querySelectorAll("input");
        console.log("clearing");
        inputs.forEach(input => {
            input.value = "";
        });
    }

    #clearWords() {
        document.querySelector("#add-source").value = "";
        document.querySelector("#add-tran").value = "";
    }

    #getCardForUpload() {

        const sourceWord = document.querySelector("#add-source").value;
        const translation = document.querySelector("#add-tran").value;
        const sourceLanguage = document.querySelector("#add-lang");
        const targetLanguage = document.querySelector("#add-tran-lang");

        if (this.#baseDeck == null) {
            this.#baseDeck = new BaseDeck(sourceLanguage.value, targetLanguage.value);
            sourceLanguage.disabled = true;
            targetLanguage.disabled = true;

        }

        const card = new BaseCard(sourceWord, translation);
        this.#baseDeck.addCard(card);
        this.#clearWords();
    }


    login(event) {
        // event.preventDefault();
        let source_language = document.querySelector("#source_language");
        let target_language = document.querySelector("#target_language");
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
        if (this.#baseDeck != null) console.log(this.#baseDeck);
        this.#baseDeck == null;
        document.querySelector("#new-card-modal").classList.toggle("is-active");
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
        console.log(input)
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
        console.log("flipping");
        inner.classList.toggle("flip");
    }

    #drawCard() {
        this.#card = this.#deck.randomCard();
        console.log("this!");
        this.#front = this.#card.word;
        console.log(this.#card.translations);
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