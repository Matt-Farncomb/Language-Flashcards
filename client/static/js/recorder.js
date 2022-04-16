class Recorder {

    #mediaRecorder;
    #recordButton;
    #audioPlayer;
    #recording;
    #chunks;


    constructor() {
        // this.#mediaRecorder = new MediaRecorder();
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
        return document.querySelector("audio");
    }


    record() {
        // TODO: Delete previous audio
        // this.#mediaRecorder.start();
        this.#recording = true;
        this.#recordButton.innerHTML = "Stop <i class='fas fa-record-vinyl'></i>"
        
        // this.#audioPlayer.classList.remove(); // TODO: reveal hidden audio

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            console.log('getUserMedia supported.');
            var self = this;
            navigator.mediaDevices.getUserMedia (
               // constraints - only audio needed for this app
               {
                  audio: true
               })
               
         
               // Success callback
               .then(function(stream) {

                    self.#mediaRecorder = new MediaRecorder(stream);
                    console.log("Recording");
                    self.#mediaRecorder.start();
                    console.log(self.#mediaRecorder.state);
                    console.log("recorder started");

                    self.#chunks = [];

                    self.#mediaRecorder.ondataavailable = function(e) {
                        self.#chunks.push(e.data);
                    }

                    self.#mediaRecorder.onstop = function(e) {
                        self.audioPlayer.setAttribute('controls', '');
                        const blob = new Blob(self.#chunks, { 'type' : 'audio/ogg; codecs=opus' });
                        self.#chunks = [];
                        const audioURL = window.URL.createObjectURL(blob);
                        self.audioPlayer.src = audioURL;
                        console.log(audioURL)
                    }   

                    
               })
         
               // Error callback
            //    .catch(function(err) {
            //       console.log('The following getUserMedia error occurred: ' + err);
            //    }
            // );
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