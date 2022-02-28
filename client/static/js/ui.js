
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

        this.#whenClicked("new-deck", () => this.#newDeck());
        this.#whenClicked("flipOver", () => this.#flipOverCard());
        this.#whenClicked("new-card", () => this.#drawCard()); 
        this.#whenClicked("logout", () => this.logout());    
        this.#whenClicked("submit-result", () => this.#server.submitResult(this.#deck));  
        this.#whenClicked("refresh-button", () => this.#server.refresh());
        this.#whenClicked("submit", () => this.#checkAnswer()); 

        document.querySelector("form").addEventListener('submit', (e) => {
            this.login(e);
        });

    }

    login(event) {
        event.preventDefault();
        let source_language = document.querySelector("#source_language");
        let target_language = document.querySelector("#target_language");
        localStorage.setItem('source_language', source_language.value);
        localStorage.setItem('target_language', target_language.value);
        console.log(target_language.value);
        this.reveal();
    }

    #whenClicked(id, func) {
        const button = document.querySelector(`#${id}`);
        button.addEventListener('click', () => { 
            func()
        } );
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
        inner.classList.toggle("rotate");
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