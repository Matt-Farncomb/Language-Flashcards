// class Submit {

//     sourceLanguage;
//     targetLanguage;
//     url;

//     constructor(sourceLanguage, targetLanguage, url) {
//         const SERVER = "";
//         this.sourceLanguage = sourceLanguage;
//         this.targetLanguage = targetLanguage;
//         this.url = `${SERVER}\\{url}\\`;
//     }
// }

// class SubmitCard extends Submit {

//     constructor(sourceLanguage, targetLanguage, url, soureWord, translations, audio) {
//         super(sourceLanguage, targetLanguage, url);
//     }

//     post() {

//     }
// }


function submitDeck (url, deck) {
    const url = `${SERVER}\\${url}\\`;
    const formData = new FormData();
    
    deck.forEach(card => {
        formData.append("source_word", card.word)
        formData.append("translations", card.translations);
        formData.append("file", card.audio, card.word); // file and filename
    });

    formData.append("source_language", [baseDeck.sourceLanguage])
    formData.append("target_language", [baseDeck.targetLanguage])
    
    fetch(url, {method: 'POST', body: formData});
}

function submitEdit(card) {}

function submitScoreUpdate(card) {}

function fetchLibrary(sourceLanguage, targetLanguage) {}

function fetchDeck(count, sourceLanguage, targetLanguage) {}


