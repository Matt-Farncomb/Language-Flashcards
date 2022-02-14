const SERVER_URL = "http://127.0.0.1:8000/";

window.onload = () => {
    console.log("Fart");
    getCards(2, "fi", "es");
}

class Card {
    constructor(word, tranlsations) {
        this.word = word;
        this.tranlsations = tranlsations;
    }
}

class Deck {
    constructor() {
        this.cards = []
    }

    addCard(card) {
        this.cards.push(card)
    }
}

function getCards(count, source_language, target_language) {
    const newDeck = new Deck()
    const url = `${SERVER_URL}?count=${count}&source_language=${source_language}&target_language=${target_language}`;
    console.log(`Fetching from: ${url}`);
    fetch(url).then(function(response) {
        response.text().then(function(text) {   
            const obj = JSON.parse(text);
            obj.forEach(element => {
                const newCard = new Card(element.source_word, element.translations)
                newDeck.addCard(newCard)
            });
            console.log(newDeck)
        });
    });
 }   
    
