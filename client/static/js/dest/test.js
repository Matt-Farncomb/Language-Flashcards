"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Word {
    constructor(word, id = null, language = null, parent = null) {
        this.word = word;
        this.id = id;
        this.language = language;
        this.parent = parent;
    }
}
class StoredDeck {
    static setItem(value) {
        localStorage.setItem("deck", value);
        window.dispatchEvent(deckUpdated);
    }
    static clear() {
        localStorage.clear();
        window.dispatchEvent(deckCleared);
    }
    static get() {
        const json = localStorage.getItem("deck");
        if (json && json != "{}") {
            const localDeck = JSON.parse(json);
            const translationLanguage = localDeck[0].translations[0].__data__.language;
            return localDeck.map(element => new PlayingCard(element.id, element.source_word.word, element.translations.map((element) => {
                const translation = element.__data__;
                return new Word(translation["word"], translation["id"], translation["language"], translation["parent"]);
            }), element.source_word.language, translationLanguage, element.source_word.voice));
        }
    }
}
class Deck {
    constructor() {
        this.deck = [];
    }
    get loaded() {
        return this.deck.length > 0;
    }
    load() {
        const storedDeck = StoredDeck.get();
        if (storedDeck) {
            this.deck = storedDeck;
        }
    }
    clear() {
        this.deck = [];
    }
    drawCard() {
        if (this.deck) {
            const top = this.deck.shift();
            this.deck.push(top);
            return top;
        }
    }
}
class BaseCard {
    constructor(id, sourceWord, translations, sourceLanguage, targetLanguage, audio) {
        this._id = id;
        this._sourceWord = sourceWord;
        this._translations = translations;
        this._sourceLanguage = sourceLanguage;
        this._targetLanguage = targetLanguage;
        this._audio = audio;
    }
    get id() {
        return this._id;
    }
    get sourceLanguage() {
        return this._sourceLanguage;
    }
    get targetLanguage() {
        return this._targetLanguage;
    }
    get sourceWord() {
        return this._sourceWord;
    }
    get translations() {
        return this._translations;
    }
    get audio() {
        return this._audio;
    }
    updateAudio(blob) {
        this._audio = blob;
    }
}
class PlayingCard extends BaseCard {
    constructor(id, sourceWord, translations, sourceLanguage, targetLanguage, audio) {
        super(id, sourceWord, translations, sourceLanguage, targetLanguage, audio);
        this._incorrectCount = this.incorrectCount;
        this._correctCount = this.correctCount;
        this._difficulty = this.difficulty;
    }
    get incorrectCount() {
        return this._incorrectCount;
    }
    get correctCount() {
        return this._correctCount;
    }
    get difficulty() {
        return this._difficulty;
    }
    updateLocalScore(score) {
        this._correctCount += score;
    }
    serialiseData() {
        return JSON.stringify({
            id: this.id,
            sourceWord: this.sourceWord,
            translations: this.translations
        });
    }
}
class Recorder {
    constructor(recorderDiv, audioURL = null) {
        const recordButton = recorderDiv.querySelector(".record");
        const audioPlayer = recorderDiv.querySelector(`.player`);
        if (recordButton && audioPlayer) {
            this.mediaRecorder = null;
            this.recordButton = recordButton;
            this.audioPlayer = audioPlayer;
            this.chunks = [];
            if (audioURL) {
                this.audioPlayer.src = audioURL;
            }
            ;
            this.recordButton.addEventListener('click', () => {
                if (this.mediaRecorder && this.mediaRecorder.state == "recording") {
                    this.stop();
                }
                else {
                    this.record();
                }
            });
        }
        else {
            throw Error(`Class 'record' cannot be found in recorder`);
        }
    }
    get clip() {
        return this._clip;
    }
    get audioSrc() {
        return this.audioPlayer.src;
    }
    set clip(value) {
        this._clip = value;
    }
    setAudioSource(blob) {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchedAudio = yield fetch(`data:audio/ogg;base64,${blob}`);
            const audioURL = window.URL.createObjectURL(yield fetchedAudio.blob());
            this.audioPlayer.src = audioURL;
        });
    }
    record() {
        return __awaiter(this, void 0, void 0, function* () {
            this.recordButton.innerHTML = "Stop <i class='fas fa-record-vinyl'></i>";
            let self = this;
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = yield navigator.mediaDevices.getUserMedia({ audio: true });
                this.mediaRecorder = new MediaRecorder(stream);
                this.mediaRecorder.start();
                this.chunks = [];
                this.mediaRecorder.ondataavailable = (e) => this.chunks.push(e.data);
                this.mediaRecorder.onstop = () => {
                    this.audioPlayer.setAttribute('controls', '');
                    const blob = new Blob(self.chunks, { 'type': 'audio/ogg; codecs=opus' });
                    this.chunks = [];
                    const audioURL = window.URL.createObjectURL(blob);
                    this.audioPlayer.src = audioURL;
                    this.clip = blob;
                    dispatchEvent(clipCreated);
                };
            }
            else {
                console.log('getUserMedia not supported on your browser!');
            }
        });
    }
    stop() {
        if (this.mediaRecorder) {
            this.recordButton.innerHTML = "Record <i class='fas fa-record-vinyl'></i>";
            this.mediaRecorder.stop();
        }
    }
}
class Modal {
    constructor(id) {
        this._id = id;
        const modal = document.querySelector(`${id}`);
        if (modal) {
            this._modal = modal;
            this.submitButton = this.nullCheckedButtonQuerySelector(`.submit`);
            this.addClickEventToModalElement(".submit", () => this.submit());
            this.addClickEventToModalElements(".close", () => this.closeModal());
        }
        else {
            throw Error(`${this.id} modal cannot be found`);
        }
    }
    get id() {
        return this._id;
    }
    get modal() {
        return this._modal;
    }
    addClickEventToModalElement(selector, callback) {
        const button = this.modal.querySelector(selector);
        if (button) {
            button.addEventListener('click', () => callback());
        }
        else
            logError(`Could not assign 'click' to ${selector} in ${this.id}`);
    }
    addClickEventToModalElements(selector, callback) {
        const elements = this.modal.querySelectorAll(selector);
        if (elements.length > 0) {
            elements.forEach(element => {
                element.addEventListener('click', () => callback());
            });
        }
        else
            logError(`Could not assign 'click' to ${selector} in ${this.id}`);
    }
    nullCheckedButtonQuerySelector(selector) {
        const element = this.modal.querySelector(selector);
        if (element) {
            return element;
        }
        throw new Error(`Cannot find ${selector} in ${this._id}`);
    }
    openModal() {
        this.modal.classList.toggle("is-active");
    }
    closeModal() {
        if (this.modal) {
            this.clear();
            this.modal.classList.toggle("is-active");
        }
    }
    clear() {
        if (this.modal) {
            const inputs = this.modal.querySelectorAll(".input");
            if (inputs.length > 0) {
                inputs.forEach(element => {
                    element.value = "";
                    element.classList.remove("is-danger", "is-primary");
                });
            }
            else {
                logError(`Unable to find inputs in ${this._id}`);
            }
        }
    }
}
class LanguageModal extends Modal {
    constructor(id) {
        super(id);
        const sourceLanguage = nullCheckedQuerySelector(this.modal, `.source-language`);
        const targetLanguage = nullCheckedQuerySelector(this.modal, `.translation-language`);
        if (sourceLanguage && targetLanguage) {
            this.sourceLanguage = this.createNewInput(LanguageInput, sourceLanguage);
            this.targetLanguage = this.createNewInput(LanguageInput, targetLanguage);
            this.targetLanguage.addSibling(this.sourceLanguage);
            this.sourceLanguage.addSibling(this.targetLanguage);
        }
        else {
            throw Error(`${this.id} modal cannot be found`);
        }
    }
    nullCheckedQuerySelectorAll(selector) {
        const elements = this.modal.querySelectorAll(selector);
        if (elements && elements.length > 0) {
            return elements;
        }
        else {
            throw new Error(`Cannot find ${selector} in ${this.id}`);
        }
    }
    lockDownInput(selector) {
        this.nullCheckedQuerySelectorAll(selector).forEach(input => input.classList.add("no-click"));
    }
    unlockInput(selector) {
        this.nullCheckedQuerySelectorAll(selector).forEach(input => input.classList.remove("no-click"));
    }
    createNewInput(input, element) {
        const newInput = new input(element);
        newInput.addOnChangeEvent(() => this.toggleSubmitButton());
        return newInput;
    }
    readyToSubmit() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.sourceLanguage.isReady()) && this.targetLanguage.isReady();
        });
    }
    revealSubmitButton() {
        var _a;
        (_a = this.modal.querySelector(".submit")) === null || _a === void 0 ? void 0 : _a.classList.remove("disabledPointer");
    }
    hideSubmitButton() {
        var _a;
        (_a = this.modal.querySelector(".submit")) === null || _a === void 0 ? void 0 : _a.classList.add("disabledPointer");
    }
    toggleSubmitButton() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.readyToSubmit()) {
                this.revealSubmitButton();
            }
            else {
                this.hideSubmitButton();
            }
        });
    }
}
class CardModal extends LanguageModal {
    constructor(id) {
        super(id);
        this.translations = [];
        const sourceWord = nullCheckedQuerySelector(this.modal, `.source`);
        const translations = this.nullCheckedQuerySelectorAll(`.translation`);
        const recorderDiv = this.modal.querySelector(`.recorder`);
        if (sourceWord && translations.length > 0 && recorderDiv) {
            this.sourceWord = this.createNewInput(WordInput, sourceWord);
            this._recorder = new Recorder(recorderDiv);
            translations.forEach(inputElement => this.translations.push(this.createNewInput(WordInput, inputElement)));
            this.translations.forEach(wordInput => {
                wordInput.addSiblings(this.translations);
            });
            this.addClickEventToModalElement(".clear", () => this.clear());
        }
        else {
            throw Error(`Class 'source' or 'translation' could not be found in ${this.id}`);
        }
    }
    get recorder() {
        return this._recorder;
    }
    validateWord(wordInput) {
        if (wordInput.validity.patternMismatch || wordInput.value == "") {
            wordInput.classList.add("is-danger");
            wordInput.classList.remove("is-primary");
            return false;
        }
        else {
            wordInput.classList.add("is-primary");
            wordInput.classList.remove("is-danger");
            return true;
        }
    }
    translationValues() {
        const values = [];
        this.translations.forEach(element => values.push(element.value));
        console.log(values);
        return values;
    }
    cloneInputBlockFromTemplate() {
        const template = document.querySelector('.translation-template');
        if (template && 'content' in document.createElement('template')) {
            const clone = template.content.cloneNode(true);
            return clone;
        }
        else {
            logError("Could not create clone");
        }
    }
    addClonedInputToBlock(clone) {
        const translationsBlock = nullCheckedQuerySelector(this.modal, '.translations-block');
        if (translationsBlock) {
            translationsBlock.appendChild(clone);
            const previouslyAddedTranslation = translationsBlock.lastElementChild;
            if (previouslyAddedTranslation) {
                const translationJustAdded = previouslyAddedTranslation.querySelector(".translation");
                if (translationJustAdded) {
                    return translationJustAdded;
                }
            }
        }
    }
    addInput() {
        var _a;
        const clone = this.cloneInputBlockFromTemplate();
        if (clone) {
            const translationJustAdded = this.addClonedInputToBlock(clone);
            if (translationJustAdded) {
                const newWordInput = this.createNewInput(WordInput, translationJustAdded);
                newWordInput.addSiblings(this.translations);
                this.translations.forEach(wordInput => wordInput.addSibling(newWordInput));
                this.translations.push(newWordInput);
                const removeButton = (_a = translationJustAdded.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector(".remove-translation");
                if (removeButton) {
                    console.log("removing");
                    removeButton.addEventListener('click', (e) => {
                        var _a, _b;
                        console.log("removed");
                        const clicked = e.target;
                        (_b = (_a = clicked === null || clicked === void 0 ? void 0 : clicked.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.remove();
                    });
                }
            }
        }
        else {
            logError(`translation-block not found in ${this.id}`);
        }
    }
    addInputOnClick() {
        const translationinput = this.modal.querySelector(".translation");
        if (translationinput) {
            if (translationinput.parentElement) {
                const addButton = translationinput.parentElement.querySelector(".add-translation");
                const template = document.querySelector('.translation-template');
                if (addButton) {
                    addButton.addEventListener('click', (e) => {
                        if (template && 'content' in document.createElement('template')) {
                            this.addInput();
                        }
                        else {
                            logError("Cant't add click event on plus icon");
                        }
                    });
                }
            }
        }
    }
    allTranslationsAreValid() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let translation of this.translations) {
                if (!(yield translation.isReady())) {
                    return false;
                }
            }
            return true;
        });
    }
    readyToSubmit() {
        const _super = Object.create(null, {
            readyToSubmit: { get: () => super.readyToSubmit }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const baseInputsReady = yield _super.readyToSubmit.call(this);
            const sourceWordReady = yield this.sourceWord.isValid();
            const translationsReady = yield this.allTranslationsAreValid();
            return baseInputsReady && sourceWordReady && translationsReady;
        });
    }
    closeModal() {
        super.closeModal();
        console.log("fart");
        const addedInputs = this.translations.slice(1);
        addedInputs.forEach(input => input.removeFromDOM());
    }
}
class CreateDeckModal extends CardModal {
    constructor(id) {
        super(id);
        this.deck = [];
        this.addInputOnClick();
        const upload = this.modal.querySelector(`.upload-deck`);
        if (upload) {
            upload.addEventListener('click', () => {
                Server.uploadDeck(this.deck);
                this.closeModal();
            });
        }
    }
    readyToSubmit() {
        const _super = Object.create(null, {
            readyToSubmit: { get: () => super.readyToSubmit }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const baseInputsReady = yield _super.readyToSubmit.call(this);
            return baseInputsReady;
        });
    }
    clearWords() {
        const wordInputs = this.modal.querySelectorAll(".word");
        if (wordInputs.length > 0) {
            wordInputs.forEach(element => {
                element.value = "";
                element.classList.remove("is-danger", "is-primary");
            });
        }
        else {
            logError(`Unable to find word inputs in ${this.id}`);
        }
    }
    closeModal() {
        super.closeModal();
        this.unlockInput(".language");
        this.deck = [];
    }
    addCardToDeck() {
        this.card = new BaseCard(this.id, this.sourceWord.value, this.translationValues().map(translation => new Word(translation)), this.sourceLanguage.value, this.targetLanguage.value, this.recorder.clip ? this.recorder.clip : null);
        this.deck.push(this.card);
        this.clearWords();
        this.lockDownInput(".language");
    }
    revealUploadButton() {
        var _a;
        (_a = this.modal.querySelector(".upload-deck")) === null || _a === void 0 ? void 0 : _a.classList.remove("disabledPointer");
    }
    hideUploadButton() {
        var _a;
        (_a = this.modal.querySelector(".upload-deck")) === null || _a === void 0 ? void 0 : _a.classList.add("disabledPointer");
    }
    submit() {
        this.addCardToDeck();
        this.revealUploadButton();
    }
}
class EditCardModal extends CardModal {
    constructor(id) {
        super(id);
        addEventListener("clipCreated", () => {
            this.toggleSubmitButton();
        });
    }
    openModal() {
        super.openModal();
    }
    buildInputList(translations) {
        translations.forEach(translation => {
            var _a;
            const clone = this.cloneInputBlockFromTemplate();
            if (clone) {
                const translationJustAdded = this.addClonedInputToBlock(clone);
                if (translationJustAdded) {
                    const newWordInput = this.createNewInput(WordInput, translationJustAdded);
                    newWordInput.value = translation.word;
                    newWordInput.addSiblings(this.translations);
                    this.translations.forEach(wordInput => wordInput.addSibling(newWordInput));
                    this.translations.push(newWordInput);
                    const removeButton = (_a = translationJustAdded.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector(".remove-translation");
                    if (removeButton) {
                        console.log("removing");
                        removeButton.addEventListener('click', (e) => {
                            var _a, _b;
                            console.log("removed");
                            const clicked = e.target;
                            (_b = (_a = clicked === null || clicked === void 0 ? void 0 : clicked.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.remove();
                        });
                    }
                }
            }
            else {
                logError(`translation-block not found in ${this.id}`);
            }
        });
    }
    populateCard(card, uiCard) {
        return __awaiter(this, void 0, void 0, function* () {
            this.card = card;
            this.uiCard = uiCard;
            this.translations[0].value = card.translations[0].word;
            const blob = card.audio;
            if (blob) {
                this.recorder.setAudioSource(blob);
                const fetchedAudio = yield fetch(`data:audio/ogg;base64,${this.card.audio}`);
                this.recorder.clip = yield fetchedAudio.blob();
            }
            if (card.translations.length > 1) {
                this.buildInputList(card.translations.slice(1));
            }
            this.addInputOnClick();
            if (this.sourceLanguage && this.targetLanguage && this.sourceWord && this.translations.length > 0) {
                this.sourceLanguage.value = languageAbbreviations[card.sourceLanguage];
                this.targetLanguage.value = languageAbbreviations[card.targetLanguage];
                this.sourceWord.value = card.sourceWord;
                for (let i = 0; i > this.translations.length; i++) {
                    this.translations[i].value = card.translations[i].word;
                }
            }
        });
    }
    submit() {
        var _a;
        console.log("subvmitting");
        if (this.card) {
            console.log("card exists");
            const cardForUpload = new TestCard(this, this.card.id);
            Server.postEdit(cardForUpload);
            (_a = this.uiCard) === null || _a === void 0 ? void 0 : _a.update(cardForUpload, this.recorder.audioSrc);
            this.closeModal();
        }
    }
}
class FetchDeckModal extends LanguageModal {
    constructor(id) {
        super(id);
        const count = nullCheckedQuerySelector(this.modal, ".count");
        if (count) {
            this.count = this.createNewInput(NumberInput, count);
        }
        else {
            throw Error(`Class 'count' cannot be found in ${this.id}`);
        }
    }
    submit() {
        this.fetchDeck();
    }
    readyToSubmit() {
        const _super = Object.create(null, {
            readyToSubmit: { get: () => super.readyToSubmit }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return (yield _super.readyToSubmit.call(this)) && (yield this.count.isValid());
        });
    }
    fetchDeck() {
        return __awaiter(this, void 0, void 0, function* () {
            const deck = yield Server.getDeck(this.count.value, this.sourceLanguage.value, this.targetLanguage.value);
        });
    }
}
class FetchTableModal extends LanguageModal {
    submit() {
        Server.goToTable(this.sourceLanguage.value, this.targetLanguage.value);
    }
}
class LogInModal extends Modal {
    constructor(id) {
        super(id);
        const username = nullCheckedQuerySelector(this.modal, ".username");
        const password = nullCheckedQuerySelector(this.modal, ".password");
        if (username && password) {
            this.username = username;
            this.password = password;
        }
        else {
            throw Error(`Class 'username' and/or 'password' cannot be found in ${this.id}`);
        }
    }
    submit() {
        this.closeModal();
    }
}
class SignUpModal extends LogInModal {
    constructor(id) {
        super(id);
        const firstname = nullCheckedQuerySelector(this.modal, ".username");
        const lastname = nullCheckedQuerySelector(this.modal, ".password");
        if (firstname && lastname) {
            this.firstname = firstname;
            this.lastname = lastname;
        }
        else {
            throw Error(`Class 'firstname' and/or 'lastname' cannot be found in ${this.id}`);
        }
    }
}
class Ui {
    constructor() {
        this.fetchDeckModal = new FetchDeckModal("#draw-deck-modal");
        this.fetchTableModal = new FetchTableModal("#open-table-modal");
        this.editModal = new EditCardModal("#edit-card-modal");
        this.createDeckModal = new CreateDeckModal("#create-deck-modal");
        this.logInModal = new LogInModal("#log-in-modal");
        this.signUpModal = new SignUpModal("#sign-up-modal");
        const user = localStorage.getItem('current_user');
        const nextCardButton = document.querySelector(".begin");
        const editButton = document.querySelector(".edit");
        const clearButton = document.querySelector(".clear-deck");
        const playButton = document.querySelector(".play");
        const flipButtons = document.querySelectorAll(".flip");
        const front = document.querySelector(".front .card-content span");
        const back = document.querySelector(".back .card-content span");
        const checkButton = document.querySelector("#check-answer");
        const answerInput = document.querySelector("#answer");
        if (nextCardButton && editButton && clearButton && front && back && editButton && playButton && checkButton && answerInput && flipButtons.length > 0) {
            this.deck = new Deck();
            this.deck.load();
            this.front = front;
            this.back = back;
            this.nextCard = nextCardButton;
            this.edit = editButton;
            this.clear = clearButton;
            this.play = playButton;
            this.flip = flipButtons;
            this.check = checkButton;
            this.answer = answerInput;
            this.clear.onclick = () => {
                StoredDeck.clear();
            };
            this.nextCard.onclick = () => {
                this.begin();
            };
            this.play.onclick = () => {
                this.playClip();
            };
            this.check.onclick = () => {
                this.checkAnswer();
            };
            this.flip.forEach(element => {
                element.onclick = () => this.flipCard(2);
            });
            if (!this.deck.loaded) {
                this.nextCard.classList.add("disabledPointer");
            }
            addEventListener('deckUpdated', () => {
                var _a, _b;
                (_a = this.deck) === null || _a === void 0 ? void 0 : _a.load();
                (_b = this.nextCard) === null || _b === void 0 ? void 0 : _b.classList.remove("disabledPointer");
                this.nextCard.onclick = () => {
                    this.begin();
                };
            });
            addEventListener('deckCleared', () => {
                var _a, _b;
                (_a = this.nextCard) === null || _a === void 0 ? void 0 : _a.classList.add("disabledPointer");
                this.unloadCard();
                (_b = this.deck) === null || _b === void 0 ? void 0 : _b.clear();
            });
        }
        else {
            throw logError("Could not create UI");
        }
        this.addClickEventToSelector("#open-edit-card-modal", () => {
            if (this.currentCard) {
                this.editModal.populateCard(this.currentCard, new UiCard(this.clip));
                this.editModal.openModal();
            }
        });
        this.addClickEventToSelector("#open-create-deck-modal", () => {
            this.createDeckModal.openModal();
        });
        this.addClickEventToSelector("#open-fetch-deck-modal", () => {
            this.fetchDeckModal.openModal();
        });
        this.addClickEventToSelector("#open-fetch-table-modal", () => {
            this.fetchTableModal.openModal();
        });
        this.addClickEventToSelector("#open-log-in-modal", () => {
            this.logInModal.openModal();
        });
        this.addClickEventToSelector("#open-sign-up-modal", () => {
            this.signUpModal.openModal();
        });
        if (user) {
            const currentSourceLanguage = localStorage.getItem('source_language');
            const currentTargetLanguage = localStorage.getItem('target_language');
            if (currentSourceLanguage && currentTargetLanguage) {
                const currentLanguages = { "source": currentSourceLanguage, "target": currentTargetLanguage };
                this.currentLanguages = currentLanguages;
            }
            else {
                this.currentLanguages = DEFAULT_LANGUAGES;
            }
        }
        else {
            localStorage.setItem("user", "demo");
            localStorage.setItem("source_language", DEFAULT_LANGUAGES.source);
            localStorage.setItem("target_language", DEFAULT_LANGUAGES.target);
            this.currentLanguages = DEFAULT_LANGUAGES;
        }
    }
    unlockAnswer() {
        this.answer.classList.remove("disabledPointer");
        this.check.classList.remove("disabledPointer");
    }
    lockAnswer() {
        this.answer.classList.add("disabledPointer");
        this.check.classList.add("disabledPointer");
    }
    resetAnswer() {
        this.answer.value = "";
        this.answer.classList.remove("has-background-success-light");
        this.check.classList.remove("has-background-success");
        this.answer.classList.remove("has-background-danger-light");
        this.check.classList.remove("has-background-danger");
    }
    checkAnswer() {
        var _a;
        if ((_a = this.currentCard) === null || _a === void 0 ? void 0 : _a.translations.some(translation => translation.word === this.answer.value)) {
            this.answer.classList.add("has-background-success-light");
            this.check.classList.add("has-background-success");
            this.answer.classList.remove("has-background-danger-light");
            this.check.classList.remove("has-background-danger");
        }
        else {
            this.answer.classList.remove("has-background-success-light");
            this.check.classList.remove("has-background-success");
            this.answer.classList.add("has-background-danger-light");
            this.check.classList.add("has-background-danger");
        }
    }
    begin() {
        var _a;
        const topCard = (_a = this.deck) === null || _a === void 0 ? void 0 : _a.drawCard();
        if (topCard) {
            this.loadCard(topCard);
            this.nextCard.innerHTML = "Next";
            this.edit.classList.remove("disabledPointer");
            this.unlockAnswer();
            this.nextCard.onclick = () => this.next();
        }
    }
    addClickEventToSelector(selector, callback) {
        const button = document.querySelector(selector);
        if (button) {
            button.addEventListener('click', () => { callback(); });
        }
        else if (LOGGING)
            console.error(`Could not assign 'click' to ${selector}`);
    }
    addClickEventToSelectorAll(selector, callback) {
        const elements = document.querySelectorAll(selector);
        if (elements && elements.length > 0) {
            elements.forEach(element => {
                element.addEventListener('click', () => { callback(); });
            });
        }
        else if (LOGGING)
            console.error(`Could not assign 'click' to ${selector}`);
    }
    next() {
        var _a;
        const nextCard = (_a = this.deck) === null || _a === void 0 ? void 0 : _a.drawCard();
        if (nextCard) {
            this.loadCard(nextCard);
            this.resetAnswer();
        }
    }
    shuffle() {
    }
    setLanguagesInUI(playingCard) {
        const sourceLanguage = document.querySelector("#user-sl");
        const targetLanguage = document.querySelector("#user-tl");
        const toSpan = document.querySelector("#to-span");
        if (sourceLanguage && targetLanguage && toSpan) {
            sourceLanguage.innerHTML = languageAbbreviations[playingCard.sourceLanguage];
            targetLanguage.innerHTML = languageAbbreviations[playingCard.targetLanguage];
            toSpan.innerHTML = "to";
        }
    }
    clearLanguagesInUI() {
        const languageInfo = document.querySelectorAll(".displayed-language-info-container span");
        if (languageInfo) {
            languageInfo.forEach(element => element.innerHTML = "");
        }
        else {
            logError("Could not find language info spans");
        }
    }
    loadCard(playingCard) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setLanguagesInUI(playingCard);
            this.currentCard = playingCard;
            this.front.innerHTML = this.currentCard.sourceWord;
            this.back.innerHTML = "";
            const ul = document.createElement("ul");
            this.currentCard.translations.forEach((translation) => {
                const li = document.createElement("li");
                console.log(translation);
                li.innerHTML = translation.word;
                ul.appendChild(li);
            });
            this.back.appendChild(ul);
            this.play.classList.remove("is-hidden");
            if (this.currentCard.audio) {
                const fetchedAudio = yield fetch(`data:audio/ogg;base64,${this.currentCard.audio}`);
                const audioURL = window.URL.createObjectURL(yield fetchedAudio.blob());
                this.clip = new Audio();
                this.clip.src = audioURL;
            }
            else {
                logInfo(`Currently loaded card ${this.currentCard.sourceWord} has no audio`);
            }
        });
    }
    unloadCard() {
        this.front.innerHTML = "";
        this.edit.classList.add("disabledPointer");
        this.play.classList.add("is-hidden");
        this.clearLanguagesInUI();
        this.lockAnswer();
    }
    playClip() {
        var _a;
        (_a = this.clip) === null || _a === void 0 ? void 0 : _a.play();
    }
    flipCard(time) {
        console.log("flipping");
        const innerCard = document.querySelector(".flip-card-inner");
        if (innerCard) {
            innerCard.style.transition = `${time}s`;
            innerCard.classList.toggle("flip");
        }
    }
}
class ExtendedInput {
    constructor(input) {
        this._htmlElement = input;
        this._siblings = [];
        this._htmlElement.oninput = () => this.validate();
    }
    get value() {
        return this._htmlElement.value;
    }
    set value(value) {
        this._htmlElement.value = value;
    }
    addOnChangeEvent(func) {
        this._htmlElement.addEventListener('change', func);
    }
    addSibling(sibling) {
        this._siblings.push(sibling);
    }
    addSiblings(siblings) {
        siblings.forEach(sibling => {
            if (sibling != this) {
                this.addSibling(sibling);
            }
        });
    }
    isEmpty() {
        return (this._htmlElement.value == "");
    }
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isValid()) {
                this.styleValid();
            }
            else {
                this.styleInvalid();
            }
        });
    }
    styleValid() {
        if (!this.isEmpty()) {
            this._htmlElement.classList.add("is-primary");
            this._htmlElement.classList.remove("is-danger");
        }
        else {
            this._htmlElement.classList.remove("is-danger", "is-primary");
        }
    }
    styleInvalid() {
        if (!this.isEmpty()) {
            this._htmlElement.classList.add("is-danger");
            this._htmlElement.classList.remove("is-primary");
        }
        else {
            this._htmlElement.classList.remove("is-danger", "is-primary");
        }
    }
    removeFromDOM() {
        var _a, _b;
        (_b = (_a = this._htmlElement.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.remove();
    }
    checkIfUnique() {
        let unique = true;
        if (this._siblings.length > 0) {
            this._siblings.forEach((element) => {
                const invalid = element._siblings.filter(innerElement => element.value == innerElement.value);
                if (invalid.length == 0) {
                    element.validate();
                }
                else {
                    invalid.forEach(e => {
                        element.styleInvalid();
                        e.styleInvalid();
                        if (unique)
                            unique = false;
                    });
                }
            });
        }
        return unique;
    }
    isReady() {
        return __awaiter(this, void 0, void 0, function* () {
            const valid = yield this.isValid();
            const unique = this.checkIfUnique();
            return valid && unique;
        });
    }
}
class WordInput extends ExtendedInput {
    constructor(input) {
        super(input);
    }
    isValid() {
        return __awaiter(this, void 0, void 0, function* () {
            return !(this._htmlElement.validity.patternMismatch || this.isEmpty());
        });
    }
}
class LanguageInput extends ExtendedInput {
    constructor(input) {
        super(input);
    }
    isValid() {
        return __awaiter(this, void 0, void 0, function* () {
            const awaitedLanguages = yield Server.validLangauges;
            return awaitedLanguages.includes(this.value);
        });
    }
}
class NumberInput extends ExtendedInput {
    constructor(input) {
        super(input);
    }
    isValid() {
        return __awaiter(this, void 0, void 0, function* () {
            const number = parseInt(this.value);
            return number > 0 && number <= 10;
        });
    }
}
const LOGGING = true;
console.info(`Logging: ${LOGGING}`);
const DEFAULT_LANGUAGES = {
    "source": "Spanish",
    "target": "Finnish"
};
try {
    const ui = new Ui();
}
catch (exception) {
    logError("Failed to create UI");
    logError(exception);
}
var _a;
class Server {
    static postEdit(card) {
        return __awaiter(this, void 0, void 0, function* () {
            const editUrl = new URL(this.baseURL);
            editUrl.pathname = "edit";
            const formData = new FormData();
            if (card.sourceWord) {
                formData.append("id", card.id);
                formData.append("source_word", card.sourceWord);
                formData.append("translations", JSON.stringify(card.translations));
                if (card.audio) {
                    formData.append("file", card.audio, `blob_${card.id}_${card.sourceWord}`);
                }
                const response = yield fetch(editUrl, { method: 'POST', body: formData });
                if (!response.ok) {
                    logError(`Could not submit edit: ${response.status}`);
                }
                else {
                    logInfo("Success!");
                }
            }
        });
    }
    static uploadDeck(deck) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploadURL = new URL(this.baseURL);
            uploadURL.pathname = "upload_deck";
            const formData = new FormData();
            formData.append("source_language", deck[0].sourceLanguage);
            formData.append("target_language", deck[0].targetLanguage);
            deck.forEach(card => {
                formData.append("source_word", card.sourceWord);
                formData.append("translations", JSON.stringify(card.translations.map(translation => translation.word)));
                if (card.audio) {
                    formData.append("file", card.audio);
                }
            });
            const response = yield fetch(uploadURL, { method: 'POST', body: formData });
            if (!response.ok) {
                logError(`Could not upload deck: ${response.status}`);
            }
            else {
                logInfo(response.statusText);
            }
        });
    }
    static getDeck(count, sourceLanguage, targetLanguage) {
        return __awaiter(this, void 0, void 0, function* () {
            const editURL = new URL(this.baseURL);
            editURL.pathname = "get_deck";
            editURL.searchParams.append("count", count);
            editURL.searchParams.append("source_language", sourceLanguage);
            editURL.searchParams.append("target_language", targetLanguage);
            const response = yield fetch(editURL);
            if (!response.ok) {
                logError(`Could not draw deck: ${response.status}`);
            }
            else {
                const responseText = yield response.text();
                StoredDeck.setItem(responseText);
            }
            return response;
        });
    }
    static getValidLanguages() {
        return __awaiter(this, void 0, void 0, function* () {
            const languagesURL = new URL(this.baseURL);
            languagesURL.pathname = "get_languages";
            const response = yield fetch(languagesURL);
            if (response.ok) {
                return JSON.parse(yield response.json());
            }
            else {
                logError(`Could not get languages: ${response.status}`);
                return [];
            }
        });
    }
    static updateScore(card, score) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateScoreURL = new URL(this.baseURL);
            updateScoreURL.pathname = "update_score";
            const formData = new FormData();
            formData.append("id", card.id);
            formData.append("score", (card.correctCount + score).toString());
            const response = yield fetch(updateScoreURL, { method: "POST", body: formData });
            if (!response.ok) {
                logError(`Could not update score: ${response.status}`);
            }
            else {
                card.updateLocalScore(score);
            }
        });
    }
    static goToTable(sourceLanguage, targetLanguage) {
        return __awaiter(this, void 0, void 0, function* () {
            const tableURL = new URL(this.baseURL);
            tableURL.pathname = "table";
            tableURL.searchParams.append("source_language", sourceLanguage);
            tableURL.searchParams.append("target_language", targetLanguage);
            tableURL.searchParams.append("is_custom", JSON.stringify(true));
            window.open(tableURL.toString());
        });
    }
}
_a = Server;
Server.baseURL = "http://127.0.0.1:8000/";
Server.validLangauges = _a.getValidLanguages();
const languageAbbreviations = {
    "es": "Spanish",
    "fi": "Finnish",
    "vi": "Vietnamese"
};
const deckUpdated = new CustomEvent('deckUpdated');
const deckCleared = new CustomEvent('deckCleared');
const clipCreated = new CustomEvent('clipCreated');
function logError(message) {
    if (LOGGING)
        console.error(message);
}
function logInfo(message) {
    if (LOGGING)
        console.info(message);
}
function nullCheckedQuerySelector(containingDiv, selector) {
    if (containingDiv) {
        const element = containingDiv.querySelector(selector);
        if (element) {
            return element;
        }
        throw new Error(`Cannot find ${selector} in ${containingDiv.id}`);
    }
    else
        throw new Error(`Cannot find modal`);
}
function addClickEventToSelector(containingDiv, selector, callback) {
    if (containingDiv) {
        const button = containingDiv.querySelector(selector);
        if (button) {
            button.addEventListener('click', () => callback());
        }
        else
            logError(`Could not assign 'click' to ${selector} in ${containingDiv.id}`);
    }
    else
        logError(`Could not find ${containingDiv}.`);
}
class TestCard {
    constructor(modal, id) {
        this.modal = modal;
        this.modalDiv = modal.modal;
        this._id = id;
    }
    get id() {
        return this._id;
    }
    get sourceLanguage() {
        const sourceLanguage = this.modalDiv.querySelector(".source-language");
        if (sourceLanguage) {
            return sourceLanguage.value;
        }
        console.log("ccan't find source language");
    }
    get targetLanguage() {
        const targetLanguage = this.modalDiv.querySelector(".translation-language");
        if (targetLanguage) {
            return targetLanguage.value;
        }
        console.log("ccan't find target Language");
    }
    get sourceWord() {
        const sourceWord = this.modalDiv.querySelector(".source");
        if (sourceWord) {
            return sourceWord.value;
        }
        console.log("ccan't find source Word");
    }
    get translations() {
        const translation_values = [];
        const translation_inputs = this.modalDiv.querySelectorAll(".translation");
        if (translation_inputs.length > 0) {
            translation_inputs.forEach(element => translation_values.push(element.value));
        }
        else {
            console.log("ccan't find source translations");
        }
        return translation_values;
    }
    get audio() {
        const clip = this.modal.recorder.clip;
        console.log(clip);
        return clip;
    }
}
class UiCard {
    constructor(clip) {
        this.cardDiv = document.querySelector(".outer-card");
        this.audio = clip;
        if (this.cardDiv) {
            const sourceWord = this.cardDiv.querySelector(".front .card-content span");
            const translations = this.cardDiv.querySelector(".back .card-content span");
            console.log(sourceWord);
            console.log(translations);
            if (sourceWord && translations) {
                this._sourceWord = sourceWord;
                this._translations = translations;
            }
            else {
                throw Error("sourceWord or translations were not found");
            }
        }
        else {
            throw Error("cardDiv was not found");
        }
    }
    set sourceWord(value) {
        this._sourceWord.innerHTML = value;
    }
    set translations(values) {
        this._translations.innerHTML = "";
        values.forEach(value => {
            const li = document.createElement("li");
            li.innerHTML = value;
            this._translations.append(li);
        });
    }
    update(card, audioURL) {
        console.log("updating");
        console.log(card);
        if (card.sourceWord) {
            this.sourceWord = card.sourceWord;
        }
        this.translations = card.translations;
        if (this.audio) {
            this.audio.src = audioURL;
        }
    }
}
//# sourceMappingURL=test.js.map