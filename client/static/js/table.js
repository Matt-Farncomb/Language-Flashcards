// const SERVER_URL = "http://127.0.0.1:8000/";

// window.onload = () => {
//     assignPlayButtons();
// }


async function fetchAudio(id) { 
    console.log("fetching");
    let url = `${SERVER_URL}audio/${id}` 
    let response = await fetch(url).then((response) => response.json());

    let audio = await fetch(`data:audio/ogg;base64,${response}`)
    .then((response) => response.blob()) 
    .then((response) => {
        return window.URL.createObjectURL(response);
    });
    return audio;
}

async function assignPlayButtons() {
    const tableButtons = document.querySelectorAll(".table .button");
    for (let e of tableButtons) {
        let id = e.parentElement.parentElement.dataset.id;
        let audio = new Audio();
        console.log("before");
        audio.src = await fetchAudio(id);
        console.log("here");
        e.addEventListener('click', () => { audio.play(); });
    }

    // tableButtons.forEach(element => {
    //     console.log(element.parentElement.parentElement)
    //     let id = element.parentElement.parentElement.dataset.id;
    //     let audio = new Audio();
    //     console.log(fetchAudio(id))
        
        // audio.src = fetchAudio(id);;
        // element.addEventListener('click', () => { 
        //     audio.play();
    //     // } );    
    // });
}

