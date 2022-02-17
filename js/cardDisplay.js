
class CardDisplay {

    front;
    back;
    card;
    button;

    constructor(deck) {
        this.deck = deck;
        this.button = document.querySelector("button");
        
        this.button.addEventListener('click', () => {
            this.drawCard();
            this.updateDisplay();
        } );
    }

    drawCard() {
        this.card = this.deck.randomCard();
        console.log(this.card)
        this.front = this.card.word;
        this.back = this.card.translations;
    }

    updateDisplay() {
        this.#updateFace();
        this.#updateBack()
    }

    #updateFace() {
        const front = document.querySelector(".flip-card-front p");
        front.textContent = this.front.word;
    }

    #updateBack() {
        const back = document.querySelector(".flip-card-back p");
        console.log(this.back[0])
        back.textContent = this.back[0].word;
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