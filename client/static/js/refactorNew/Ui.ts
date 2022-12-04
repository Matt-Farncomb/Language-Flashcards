

class Ui {
    currentCard: CardModal;
    deck: PlayingCard[];
    editModal: EditCardModal;
    createCardModal: CreateCardModal;
    fetchDeckModal: FetchDeckModal;
    fetchTableModal: FetchTableModal;
    playingDeck: PlayingDeck;
    currentLanauges: LanguagePair;

    constructor() {
        
        this.editModal = new EditCardModal("#edit-modal");
        this.createCardModal = new CreateCardModal("#create-modal");
        this.fetchDeckModal = new FetchDeckModal("#draw-card-modal");
        this.fetchTableModal = new FetchTableModal("#draw-library-modal");
        this.playingDeck = new PlayingDeck();

        addClickEventToSelector("#open-edit-modal", () => {
            this.editModal.populateCard(this.currentCard);
            this.editModal.openModal()
            }
        );

        const user = localStorage.getItem('current_user');
        
        // if user has logged in, get the languages
        if (user) {
            const currentSourceLanguage: string | null  = localStorage.getItem('source_language');
            const currentTargetLanguage: string | null  = localStorage.getItem('target_language');

            if (currentSourceLanguage && currentTargetLanguage) {
                const currentLanauges: LanguagePair = { "source": currentSourceLanguage, "target": currentTargetLanguage }
            }
            else {
                // no language set so get it from the server and check if it returns successfully
                const newLanguages: LanguagePair = Serverr.getLanguages();
            }
        } else {
            // user has not logged in so create demo user. TODO: Launch user LogIn Model
            localStorage.setItem("user", "demo");
            localStorage.setItem("source_language", "Spanish");
            localStorage.setItem("target_language", "Finnish");
        }
       
     }
}