
class UI {

    #deck;
    #front;
    #back;
    #card;

    #newCardButton;
    #newDeckButton;
    #deckDiv;
    #submitButton;
    #submitResult;
    #refreshButton;
    #flipOverButton;
    #form;
    #textInput;
    #logout;
    #loggedIn;

    #server;
    #deckSize;

    constructor(deck, server, deckSize) {
        this.#loggedIn = this.#loggedInFunc();
        this.#deck = deck;
        this.#server = server;
        this.#deckSize = deckSize;
        this.#logout = document.querySelector("#logout");
        this.#deckDiv = document.querySelector("#deck");
        this.#newCardButton = document.querySelector("#new-card");
        this.#newDeckButton = document.querySelector("#new-deck");
        this.#submitButton = document.querySelector("#submit");
        this.#submitResult = document.querySelector("#submit-result");
        this.#flipOverButton = document.querySelector("#flipOver");
        this.#textInput = document.querySelector("textarea");
        this.#refreshButton = document.querySelector("#refresh-button");
        this.#form = document.querySelector("form");
        
        this.#newCardButton.addEventListener('click', () => {
            this.#drawCard();
            this.#updateDisplay();
        } );

        this.#flipOverButton.addEventListener('click', () => {
        const inner = document.querySelector(".flip-card-inner");
           inner.classList.toggle("rotate");
        } );

        this.#newCardButton.addEventListener('click', () => {
            this.#drawCard();
            this.#updateDisplay();
        } );

        this.#logout.addEventListener('click', () => {
            this.logout();
        } );

        this.#submitResult.addEventListener('click', () => {
            this.#server.submitResult(this.#deck);
        } );

        this.#refreshButton.addEventListener('click', () => {
            this.#server.refresh(this.#refreshButton);
        } );

        this.#form.addEventListener('submit', (e) => {
            e.preventDefault();
            let source_language = document.querySelector("#source_language");
            let target_language = document.querySelector("#target_language");
            localStorage.setItem('source_language', source_language.value);
            localStorage.setItem('target_language', target_language.value);
            this.reveal();
        });

        this.#submitButton.addEventListener('click', () => {
           const input = this.#textInput.value;
           if (this.#card.isCorrectTranslation(input)) {
               console.log("Correct");
           } else {
                console.log("wrong");
           }
        } );
    }

    reveal() {
        if (this.#loggedInFunc()) {
            console.log("logged in")
            this.#deckDiv.classList.remove("hidden");
        }
    }

   
    #loggedInFunc() {
        if (localStorage.getItem('source_language', 'lang')) {
            console.log("logged in here too")
            return true;
        }
        else return false;
    }

    logout() {
        localStorage.removeItem("source_language");
        localStorage.removeItem("target_language");
        this.#deckDiv.classList.add("hidden");
        this.#loggedIn = false;
    }

    #drawCard() {
        this.#card = this.#deck.randomCard();
        console.log(this.#card)
        this.#front = this.#card.word;
        this.#back = this.#card.translations;
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

    #refreshServer() {
        this.#server.refreshServer();
    }

    // createFront() {
    //     const front = document.createElement("div");
    //     const frontText = document.createElement("p");
    //     frontText.innerHTML = this.front;
    //     front.appendChild(frontText);
    //     return front;
    // }

    // createBack() {
    //     const back = document.createElement("div");
    //     const backText = document.createElement("p");
    //     backText.innerHTML = this.back;
    //     back.appendChild(backText);
    //     return back;
    // }

    // createCard() {
    //     const card = document.createElement("div");
    //     const innerCard = document.createElement("div");
        
    //     innerCard.appendChild(this.createFront());
    //     innerCard.appendChild(this.createBack());
    //     card.appendChild(innerCard);
    // }
}