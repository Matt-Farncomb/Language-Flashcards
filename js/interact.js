const SERVER_URL = "http://127.0.0.1:8000/";

window.onload = () => {
    console.log("Fart");
    // getCards("fi");
}

function getCards(language) {
    const url = `${SERVER_URL}${language}/someURL`;
    console.log(`Fetching from: ${url}`);
    fetch(url).then(function(response) {
        response.text().then(function(text) {
            //const obj = JSON.parse(text);
            console.log(`Received: ${text}`);

        });
    });
 }   
    
