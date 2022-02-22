
class UI {

    #deck;
    #front;
    #back;
    #card;

    #loggedIn;
    #server;
    #deckSize;

    // #logout = document.querySelector("#logout");
    #deckDiv = document.querySelector("#deck");
    // #newCardButton = document.querySelector("#new-card");
    #newDeckButton = document.querySelector("#new-deck");
    #submitButton = document.querySelector("#submit");
    // #submitResult = document.querySelector("#submit-result");
    // #flipOverButton = document.querySelector("#flipOver");
    #textInput = document.querySelector("textarea");
    #refreshButton = document.querySelector("#refresh-button");
    #form = document.querySelector("form");

    constructor(deck, server, deckSize) {
        this.#loggedIn = this.#loggedInFunc();
        this.#deck = deck;
        this.#server = server;
        this.#deckSize = deckSize;

        this.whenClicked("flipOver", () => this.flipOverCard());
        this.whenClicked("new-card", () => this.#drawCard()); 
        this.whenClicked("logout", () => this.logout());    
        this.whenClicked("submit-result", () => this.#server.submitResult(this.#deck));  
        this.whenClicked("refresh-button", () => this.#server.refresh());
        this.whenClicked("submit", () => checkAnswer()); 
        // this.#newCardButton.addEventListener('click', () => {
        //     this.#drawCard();
        //     this.#updateDisplay();
        // } );

        // this.#flipOverButton.addEventListener('click', () => {
        // const inner = document.querySelector(".flip-card-inner");
        //    inner.classList.toggle("rotate");
        // } );

        // this.#logout.addEventListener('click', () => {
        //     this.logout();
        // } );

        // this.#submitResult.addEventListener('click', () => {
        //     this.#server.submitResult(this.#deck);
        // } );

        // this.#refreshButton.addEventListener('click', () => {
        //     this.#server.refresh();
        // } );

        this.#form.addEventListener('submit', (e) => {
            this.login(e);
            // e.preventDefault();
            // let source_language = document.querySelector("#source_language");
            // let target_language = document.querySelector("#target_language");
            // localStorage.setItem('source_language', source_language.value);
            // localStorage.setItem('target_language', target_language.value);
            // this.reveal();
        });

        // this.#submitButton.addEventListener('click', () => {
        //    const input = this.#textInput.value;
        //    if (this.#card.isCorrectTranslation(input)) {
        //        console.log("Correct");
        //    } else {
        //         console.log("wrong");
        //    }
        // } );
    }

    login(e) {
        e.preventDefault();
        let source_language = document.querySelector("#source_language");
        let target_language = document.querySelector("#target_language");
        localStorage.setItem('source_language', source_language.value);
        localStorage.setItem('target_language', target_language.value);
        this.reveal();
    }


    whenClicked(id, func) {
        const button = document.querySelector(`#${id}`);
        button.addEventListener('click', () => { 
            func()
        } );
    }

    checkAnswer() {
        const input = this.#textInput.value;
        if (this.#card.isCorrectTranslation(input)) {
            console.log("Correct");
        } else {
             console.log("wrong");
        }
    }

    flipOverCard() {
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