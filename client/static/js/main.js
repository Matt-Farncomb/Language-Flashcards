const SERVER_URL = "http://127.0.0.1:8000/";

window.onload = () => {
    loadMain();
}

function loadMain() {
    const DECKSIZE = 3;
    const SERVER = new Server(SERVER_URL);
    const DECK = new Deck();
    const INTERFACE = new UI(DECK, SERVER, DECKSIZE);
}

