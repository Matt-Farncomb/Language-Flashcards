class Recorder {

    private recordButton: HTMLButtonElement;
    private audioPlayer: HTMLAudioElement;
    private _clip: Blob | undefined;

    private chunks: any;
    private mediaRecorder: MediaRecorder | null;

    constructor(recorderDiv: HTMLDivElement, audioURL=null) {

        const recordButton: HTMLButtonElement | null = recorderDiv.querySelector(".record");
        const audioPlayer: HTMLAudioElement | null  = recorderDiv.querySelector(`.player`);

        if (recordButton && audioPlayer) {
            this.mediaRecorder = null;
            this.recordButton = recordButton;
            this.audioPlayer = audioPlayer;
            this.chunks = [];

            if (audioURL) {
                this.audioPlayer.src = audioURL
            };

            this.recordButton.addEventListener('click', () => { 
                if (this.mediaRecorder && this.mediaRecorder.state == "recording") {
                    this.stop();
                } else {
                    this.record();
                }
            });

        } else {
            throw Error(`Class 'record' cannot be found in recorder`);
        }

    }

    get clip() {
        return this._clip;
    }

    set clip(value) {
        this._clip = value;
    }


    async record() {

        this.recordButton.innerHTML = "Stop <i class='fas fa-record-vinyl'></i>"

        let self = this;
        
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
             
            const stream: MediaStream = await navigator.mediaDevices.getUserMedia ({audio: true});
            this.mediaRecorder = new MediaRecorder(stream);
            this.mediaRecorder.start();
            this.chunks = [];

            this.mediaRecorder.ondataavailable = (e) =>  this.chunks.push(e.data);
                   
            this.mediaRecorder.onstop = () => {
                this.audioPlayer.setAttribute('controls', '');
                const blob = new Blob(self.chunks, { 'type' : 'audio/ogg; codecs=opus' });
                this.chunks = [];
                const audioURL: string = window.URL.createObjectURL(blob);
                this.audioPlayer.src = audioURL;
                this.clip = blob;
            } 

         } else {
            console.log('getUserMedia not supported on your browser!');
         }
    }

    stop() {
        if (this.mediaRecorder) {
            this.recordButton.innerHTML = "Record <i class='fas fa-record-vinyl'></i>"
            this.mediaRecorder.stop();
        }
    }
}