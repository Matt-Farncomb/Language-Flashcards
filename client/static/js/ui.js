
class UI {

    #deck;
    #front;
    #back;
    #card;

    #loggedIn;
    #server;
    #deckSize;

    constructor(deck, server, deckSize) {
        this.#loggedIn = this.#loggedInFunc();
        this.#deck = deck;
        this.#server = server;
        this.#deckSize = deckSize;

        document.querySelector("#user-sl").innerText = localStorage.getItem('source_language', 'lang');
        document.querySelector("#user-tl").innerText = localStorage.getItem('target_language', 'lang');

        // this.#whenClicked("#draw-deck", () => this.#newDeck());
        this.#whenClicked("#draw-deck", () => this.login());
        this.#whenClicked(".close-deck-modal", () => this.#revealDeckForm());
        this.#whenClicked("#new-deck", () => this.#revealDeckForm());

        this.#whenClicked("#front-flip", () => this.#flipOverCard());
        this.#whenClicked("#back-flip", () => this.#flipOverCard());
        this.#whenClicked("#new-card", () => this.#drawCard()); 
        this.#whenClicked("#logout", () => this.logout());    
        this.#whenClicked("#submit-result", () => this.#server.submitResult(this.#deck));  
        this.#whenClicked("#refresh-button", () => this.#server.refresh());
        this.#whenClicked("#submit", () => this.#checkAnswer()); 

        // document.querySelector("form").addEventListener('submit', (e) => {
        //     this.login(e);
        // });

    }

    login(event) {
        // event.preventDefault();
        let source_language = document.querySelector("#source_language");
        let target_language = document.querySelector("#target_language");
        let deck_size = document.querySelector("#deck-size");
        localStorage.setItem('source_language', source_language.value);
        localStorage.setItem('target_language', target_language.value);
        console.log(deck_size.value);
        // this.reveal();
    }

    #revealDeckForm() {
        document.querySelector("#deck-modal").classList.toggle("is-active");
    }

    #whenClicked(id, func) {
        const button = document.querySelectorAll(`${id}`);
        button.forEach(element => {
            element.addEventListener('click', () => { 
                func()
            } );
        });
       
    }

    #checkAnswer() {
        const input = document.querySelector("textarea").value;
        if (this.#card.isCorrectTranslation(input)) {
            console.log("Correct");
        } else {
             console.log("wrong");
        }
    }

    #flipOverCard() {
        const inner = document.querySelector(".flip-card-inner");
        console.log("flipping");
        inner.classList.toggle("flip");
    }

    #drawCard() {
        this.#card = this.#deck.randomCard();
        console.log(this.#card)
        this.#front = this.#card.word;
        this.#back = this.#card.translations;
        this.#updateDisplay();
    }


    reveal() {
        if (this.#loggedInFunc()) {
            console.log("logged in")
            const deck = document.querySelector("#deck");
            deck.classList.remove("hidden");
        }
    }

   
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
        const front = document.querySelector(".flip-card-front p");
        front.textContent = this.#front.word;
    }

    #updateBack() {
        const back = document.querySelector(".flip-card-back p");
        back.innerHTML = "";
        this.#back.forEach(element => {
            const li = document.createElement("li");
            li.innerText = element.word;
            back.appendChild(li);
        });
    }

    #newDeck() {
        const deckSize = document.querySelector("#deck-size").value;
        this.#deck.getDeck(this.#server, deckSize);
    }

    #refreshServer() {
        this.#server.refreshServer();
    }

}