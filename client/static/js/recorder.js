class Recorder {

    #mediaRecorder;
    #recordButton;
    #audioPlayer;
    #recording;
    #chunks;
    #customCard;


    constructor(customCard, ui, modal) {
        // this.#mediaRecorder = new MediaRecorder();
        this.#chunks = [];
        this.#customCard = customCard;
        console.log(modal)
        this.#recordButton = document.querySelector(`${modal} .record`);
        this.#audioPlayer = document.querySelector(`${modal} .player`);
        this.ui = ui;

        this.#recordButton.addEventListener('click', () => { 
            if (this.#recording) {
                this.stop();
                this.ui.readyToUpload();
            } else {
                this.record();
                this.ui.disableAddCard();
            }
        });
    }

   

    get audioPlayer() {
        return this.#audioPlayer;
    }


    async record() {

        this.#recording = true;
        this.#recordButton.innerHTML = "Stop <i class='fas fa-record-vinyl'></i>"

        var self = this;
        
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
             
            const stream = await navigator.mediaDevices.getUserMedia ({audio: true});
            this.#mediaRecorder = new MediaRecorder(stream);
            this.#mediaRecorder.start();
            this.#chunks = [];

            this.#mediaRecorder.ondataavailable = (e) =>  this.#chunks.push(e.data);
   
            // this.#mediaRecorder.ondataavailable = (e) => this.#chunks.push(e.data);
                
            this.#mediaRecorder.onstop = () => {
                this.audioPlayer.setAttribute('controls', '');
                const blob = new Blob(self.#chunks, { 'type' : 'audio/ogg; codecs=opus' }); // Both can caoncert into wav with simply rename. What is the difference?
                const recordBlob = new Blob(self.#chunks, {type:'audio/wav; codecs=MS_PCM'});
                this.#chunks = [];
                const audioURL = window.URL.createObjectURL(blob);
                this.audioPlayer.src = audioURL;
                this.#customCard.audio = blob;
            } 

         } else {
            console.log('getUserMedia not supported on your browser!');
         }
    }

    // filename of recording is just the word_language. Doesn't need anything else as this will already make it unique. Almost like an id.
    stop() {
        console.log(this.#recording)
        // this.#mediaRecorder.stop();
        this.#recording = false;
        this.#recordButton.innerHTML = "Record <i class='fas fa-record-vinyl'></i>"
        this.#mediaRecorder.stop();
        console.log(this.#mediaRecorder.state);

        // this.audioPlayer.setAttribute('controls', '');

        // const blob = new Blob(this.#chunks, { 'type' : 'audio/ogg; codecs=opus' });
        // this.#chunks = [];
        // const audioURL = window.URL.createObjectURL(blob);
        // this.audioPlayer.src = audioURL;
        // console.log('The following getUserMedia error occurred: ' + err);
        // TODO: Save audio
    }


}