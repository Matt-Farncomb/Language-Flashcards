type LanguagePair = {
    "source": string;
    "target": string;
}

class Ui {
    currentCard;
    deck;
    editModal;
    fetchLibraryModal;
    drawDeckModal;
    createDeckModal;
    currentLanauges: LanguagePair;

    constructor() {
        const editModal = new EditCardModal("#edit-modal");
        const fetchLibraryModal = new UploadCardModal("#edit-modal");
        const currentSourceLanguage = localStorage.getItem('source_language');
        const currentTargetLanguage = localStorage.getItem('target_language');
        const openEditModalButton = document.querySelector("#open-edit-modal");

        if (currentSourceLanguage && currentTargetLanguage) {
            const currentLanauges: LanguagePair = { "source": currentSourceLanguage, "target": currentTargetLanguage }
        }
        else {
            // get it from the server and check if it returns successfully
        }
       
        if (openEditModalButton) {
            openEditModalButton.addEventListener("click" , () => {
                editModal.openModal(this.currentCard);
            })
        }
       

        // document.querySelector("#open-edit-modal")?.addEventListener("click" , () => {
        //     fetchLibraryModal.openModal(this.currentLanauges);
        // })

        // document.querySelector("#open-edit-modal")?.addEventListener("click" , () => {
        //     editModal.openModal();
        // })

        // document.querySelector("#open-edit-modal")?.addEventListener("click" , () => {
        //     editModal.openModal();
        // })
     }
}