const SERVER_URL = "http://127.0.0.1:8000/";

window.onload = () => {
    
    //const finnishAlphabet = alphabet.Finnish;

    getLanguages();
    getAlphabet();



}

    
    



function createCards2(obj) {
    const cards = document.querySelector("#cards");
    const language = JSON.parse(obj);
    //console.log(newobj.Finnish);
    language.Finnish.forEach(character => {
        let clickCounter = 0;
        const newCard = document.createElement("div");
        const letterSpan = document.createElement("span");
        const soundSpan = document.createElement("span");
        const translationSpan = document.createElement("span");

        const url = character.sound;
        //console.log(url);
        const audioObj = new Audio(url);

        soundSpan.classList.add("invisible");
        translationSpan.classList.add("invisible");
        newCard.appendChild(letterSpan);
        newCard.appendChild(soundSpan);
        newCard.appendChild(audioObj);
        newCard.appendChild(translationSpan);

        letterSpan.innerHTML = character.letter;
        soundSpan.innerHTML = character.example;
        translationSpan.innerHTML = character.translation;

        cards.appendChild(newCard);

        newCard.addEventListener('click', () => {
            console.log(clickCounter);
            audioObj.play();
            if (clickCounter == 0) {
                
                swapContent(letterSpan, soundSpan);
                clickCounter++;
            } else if (clickCounter == 1) {
                swapContent(soundSpan, translationSpan);
                clickCounter++;
            } else if (clickCounter == 2) {
                swapContent(translationSpan, letterSpan);  
                clickCounter = 0;
            }  
        }, clickCounter);

    });
}



function swapContent(oldSpan, newSpan) {
    oldSpan.classList.toggle("invisible");
    newSpan.classList.toggle("invisible");
}

function getAlphabet() {
    const url = SERVER_URL;
    getContentFromServer(url, createCards2); 
}


function getContentFromServer(url, func) {
    fetch(url).then(function(response) {
        response.text().then(function(text) {
            const obj = JSON.parse(text);
            func(text);
            //createCards2(text);
          //console.log(obj);
        });
    });
}

function getLanguages() {
    const url = SERVER_URL + "languages";
    fetch(url).then(function(response) {
        response.text().then(function(text) {

            const obj = JSON.parse(text);
            const lanuageSelection = document.querySelector("#languages");

            lanuageSelection.addEventListener('click', () => {
                obj.forEach(language => {
                    console.log(language);
                })
            })
        });
    });
}


