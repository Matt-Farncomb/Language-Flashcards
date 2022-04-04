const SERVER_URL = "http://127.0.0.1:8000/";

window.onload = () => {

    // if (localStorage.getItem('source_language')) {
    //     // const test = new LoginUI();
    //     // console.log(test)
    //     loadMain();
    // } else {

    // }
    loadMain();
    // const DECKSIZE = 3;
    // console.log("Fart");
    // const SERVER = new Server(SERVER_URL);
    // const DECK = new Deck();
    // console.log(SERVER);
    // DECK.getDeck(SERVER, DECKSIZE);
    // console.log(DECK);
    // const UserInterface = new UI(DECK, SERVER, DECKSIZE);

}

function loadMain() {
    const DECKSIZE = 3;
    console.log("Fart");
    const SERVER = new Server(SERVER_URL);
    const bob = SERVER.languages;
    // bob.then(response => console.log(response));

    const DECK = new Deck();
    console.log(SERVER);
    //DECK.getDeck(SERVER, DECKSIZE);
    // console.log(DECK);
    const UserInterface = new UI(DECK, SERVER, DECKSIZE);
    // UserInterface.reveal();
}

// function getLocalDeck() {
//     localStorage.removeItem('deck');
//     if (localStorage.getItem('deck')) {
//         const deckJSON = localStorage.getItem('deck');
//         console.log(JSON.parse(deckJSON));
//         return JSON.parse(deckJSON);
//     } else {
//         return new Deck();
//     }
// }
