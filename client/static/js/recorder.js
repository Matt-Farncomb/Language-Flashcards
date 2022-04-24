class Recorder {

    #mediaRecorder;
    #recordButton;
    #audioPlayer;
    #recording;
    #chunks;
    #customCard;


    constructor(customCard) {
        // this.#mediaRecorder = new MediaRecorder();
        this.#chunks = [];
        this.#customCard = customCard;
        this.#recordButton = document.querySelector("#record");

        this.#recordButton.addEventListener('click', () => { 
            if (this.#recording) {
                this.stop();
            } else {
                this.record();
            }
        });
    }

    get audioPlayer() {
        return document.querySelector("#player");
    }


    async record() {

        this.#recording = true;
        this.#recordButton.innerHTML = "Stop <i class='fas fa-record-vinyl'></i>"

        var self = this;
        
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            
            const stream = await navigator.mediaDevices.getUserMedia ({audio: true });
            this.#mediaRecorder = new MediaRecorder(stream);
            this.#mediaRecorder.start();
            this.#chunks = [];

            this.#mediaRecorder.ondataavailable = function(e) {
                self.#chunks.push(e.data);
            }

            // this.#mediaRecorder.ondataavailable = (e) => this.#chunks.push(e.data);
                
           

            this.#mediaRecorder.onstop = function() {
                self.audioPlayer.setAttribute('controls', '');
                const blob = new Blob(self.#chunks, { 'type' : 'audio/ogg; codecs=opus' });
                self.#chunks = [];
                const audioURL = window.URL.createObjectURL(blob);
                self.audioPlayer.src = audioURL;
                self.#customCard.audio = blob;
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