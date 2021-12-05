window.onload = () => {
    const cards = document.querySelector("#cards");
    const finnishAlphabet = alphabet.Finnish;
    createCards(finnishAlphabet);
}


function createCards(finnishAlphabet) {

    finnishAlphabet.forEach(character => {

        const newCard = document.createElement("div");
        const letterSpan = document.createElement("span");
        const soundSpan = document.createElement("span");

        soundSpan.classList.add("invisible");
        newCard.appendChild(letterSpan);
        newCard.appendChild(soundSpan);

        letterSpan.innerHTML = character.character;
        soundSpan.innerHTML = character.sound.example;

        cards.appendChild(newCard);

        newCard.addEventListener('click', () => {
            const newContent = character.sound.example;
            swapContent(newContent, letterSpan, soundSpan);
        });

    });
}

function swapContent(content, letterSpan, soundSpan) {
    letterSpan.classList.toggle("invisible");
    soundSpan.classList.toggle("invisible");
    console.log(content);
}

