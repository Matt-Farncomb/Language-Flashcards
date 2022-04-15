class Recorder {

    #mediaRecorder;
    #recordButton;
    #audioPlayer;
    #recording;

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

    record() {
        // TODO: Delete previous audio
        // this.#mediaRecorder.start();
        this.#recording = true;
        this.#recordButton.innerHTML = "Stop <i class='fas fa-record-vinyl'></i>"
        // this.#audioPlayer.classList.remove(); // TODO: reveal hidden audio
    }

    stop() {
        // this.#mediaRecorder.stop();
        this.#recording = false;
        this.#recordButton.innerHTML = "Record <i class='fas fa-record-vinyl'></i>"
        // TODO: Save audio
    }

}