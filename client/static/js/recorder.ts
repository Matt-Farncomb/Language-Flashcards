class Recorder {

    private recordButton: HTMLButtonElement;
    private _clip: Blob;

    constructor(recorderDiv: HTMLDivElement) {

        const recordButton: HTMLButtonElement | null = recorderDiv.querySelector(".record");

        if (recordButton) {
            this.recordButton = recordButton;
        }

    }

    get clip() {
        return this._clip;
    }
}