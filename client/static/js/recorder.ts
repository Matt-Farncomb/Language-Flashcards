class Recorder {

    private recordButton: HTMLButtonElement;
    private _clip: Blob | undefined;

    constructor(recorderDiv: HTMLDivElement) {

        const recordButton: HTMLButtonElement | null = recorderDiv.querySelector(".record");

        if (recordButton) {
            this.recordButton = recordButton;
            this.recordButton.addEventListener('click', this.record);
        } else {
            throw Error(`Class 'record' cannot be found in recorder`);
        }

    }

    get clip() {
        return this._clip;
    }

    record() {
        console.log("recording");
    }
}