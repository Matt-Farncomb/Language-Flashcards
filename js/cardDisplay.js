
class CardDisplay {
    constructor(card) {
        this.front = card.source_word;
        this.back = card.translations;
        this.displayTable = document.querySelector("body");
    }

    createFront() {
        const front = document.createElement("div");
        const frontText = document.createElement("p");
        frontText.innerHTML = this.front;
        front.appendChild(frontText);
        return front;
    }

    createBack() {
        const back = document.createElement("div");
        const backText = document.createElement("p");
        backText.innerHTML = this.back;
        back.appendChild(backText);
        return back;
    }

    createCard() {
        const card = document.createElement("div");
        const innerCard = document.createElement("div");
        
        innerCard.appendChild(this.createFront());
        innerCard.appendChild(this.createBack());
        card.appendChild(innerCard);
    }
}