const SERVER_URL = "http://127.0.0.1:8000/";

window.onload = () => {
    console.log("Fart");
    const SERVER = new Server(SERVER_URL);
    const DECK = new Deck("fi", "es");
    console.log(SERVER);
    DECK.getDeck(SERVER, 3);
    console.log(DECK);
    const DISPLAY = new CardDisplay(DECK);

}
