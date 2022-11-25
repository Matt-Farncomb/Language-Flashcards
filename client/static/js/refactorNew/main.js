try {
    const editModal = new Modal("#edit-modal", submitEdit);
    const fetchLibraryModal = new Modal("#edit-modal", fetchLibrary);
    const drawDeckModal = new Modal("#edit-modal", fetchDeck);
    const createDeckModal = new Modal("#edit-modal", submitDeck);
} catch (exception) {
    console.error(exception);
}