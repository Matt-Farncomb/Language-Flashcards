
class CardDisplay {

    #deck;
    #front;
    #back;
    #card;

    #newCardButton;
    #newDeckButton;
    #submitButton;
    #textInput;

    #server;
    #deckSize;

    constructor(deck, server, deckSize) {
        this.#deck = deck;
        this.#server = server;
        this.#deckSize = deckSize;
        this.#newCardButton = document.querySelector("#new-card");
        this.#newDeckButton = document.querySelector("#new-deck");
        this.#submitButton = document.querySelector("#submit");
        this.#textInput = document.querySelector("textarea");
        
        this.#newCardButton.addEventListener('click', () => {
            this.#drawCard();
            this.#updateDisplay();
        } );

        this.#newDeckButton.addEventListener('click', () => {
            this.#deck = new Deck("fi", "es");
            this.#deck.getDeck(this.#server, this.#deckSize);
        } );

        this.#submitButton.addEventListener('click', () => {
           const input = this.#textInput.value;
           console.log(this.#textInput.value);
           if (this.#card.isCorrectTranslation(input)) {
               console.log("Correct");
           } else {
                console.log("wrong");
           }
           const inner = document.querySelector(".flip-card-inner");
           inner.classList.add("rotate");

        } );
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