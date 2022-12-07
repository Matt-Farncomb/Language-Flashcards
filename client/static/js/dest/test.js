var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
class Recorder {
    constructor(recorderDiv) {
        const recordButton = recorderDiv.querySelector(".record");
        if (recordButton) {
            this.recordButton = recordButton;
        }
    }
    get clip() {
        return this._clip;
    }
}
class Modal {
    constructor(id) {
        this._id = id;
        this._modal = document.querySelector(`${id}`);
        if (this._modal) {
            this.sourceLanguage = this.nullCheckedQuerySelector(`.source-language`);
            this.targetLanguage = this.nullCheckedQuerySelector(`.translation-language`);
            this.submitButton = this.nullCheckedButtonQuerySelector(`.submit`);
            const inputs = this.nullCheckedQuerySelectorAll(`.input`);
            inputs.forEach(input => {
                input.onchange = () => this.validateForSubmit();
            });
            this.addClickEventToSelector(".submit", () => this.submit());
            this.addClickEventToSelector(".clear", () => this.clear());
            this.addClickEventToSelectorAll(".close", () => this.closeModal());
        }
        else {
            throw Error(`${this._id} modal cannot be found`);
        }
    }
    get id() {
        return this._id;
    }
    get modal() {
        return this._modal;
    }
    addClickEventToSelector(selector, callback) {
        const button = this.modal.querySelector(selector);
        if (button) {
            button.addEventListener('click', () => callback());
        }
        else
            logError(`Could not assign 'click' to ${selector} in ${this.id}`);
    }
    addClickEventToSelectorAll(selector, callback) {
        const elements = this.modal.querySelectorAll(selector);
        if (elements && elements.length > 0) {
            elements.forEach(element => {
                element.addEventListener('click', () => callback());
            });
        }
        else
            logError(`Could not assign 'click' to ${selector} in ${this.id}`);
    }
    nullCheckedQuerySelector(selector) {
        var _a;
        const element = (_a = this.modal) === null || _a === void 0 ? void 0 : _a.querySelector(selector);
        if (element) {
            return element;
        }
        throw new Error(`Cannot find ${selector} in ${this._id}`);
    }
    nullCheckedButtonQuerySelector(selector) {
        var _a;
        const element = (_a = this.modal) === null || _a === void 0 ? void 0 : _a.querySelector(selector);
        if (element) {
            return element;
        }
        throw new Error(`Cannot find ${selector} in ${this._id}`);
    }
    nullCheckedQuerySelectorAll(selector) {
        var _a;
        const elements = (_a = this.modal) === null || _a === void 0 ? void 0 : _a.querySelectorAll(selector);
        if (elements && elements.length > 0) {
            return elements;
        }
        throw new Error(`Cannot find ${selector} in ${this._id}`);
    }
    openModal() {
        if (this.modal)
            this.modal.classList.toggle("is-active");
    }
    closeModal() {
        if (this.modal)
            this.modal.classList.toggle("is-active");
    }
    validateLanguage(languageInput) {
        if (languageInput.value in Server.validLangauges) {
            languageInput.classList.add("is-primary");
            languageInput.classList.remove("is-danger");
            return true;
        }
        else {
            languageInput.classList.add("is-danger");
            languageInput.classList.remove("is-primary");
            return false;
        }
    }
    validateLanguages() {
        return this.validateLanguage(this.sourceLanguage) && this.validateLanguage(this.targetLanguage);
    }
    clear() {
        if (this.modal) {
            const inputs = this.modal.querySelectorAll(".input");
            if (inputs.length > 0) {
                inputs.forEach(element => {
                    element.value = "";
                });
            }
            else {
                logError(`Unable to find inputs in ${this._id}`);
            }
        }
    }
}
class CardModal extends Modal {
    constructor(id) {
        super(id);
        if (this.modal) {
            this.sourceWord = this.nullCheckedQuerySelector(`.source`);
            this.translations = this.nullCheckedQuerySelectorAll(`.translation`);
            const recorderDiv = this.nullCheckedQuerySelector(`.recorder`);
            this.recorder = new Recorder(recorderDiv);
        }
    }
    validateForSubmit() {
        if (this.validateWords() && this.validateLanguages()) {
            this.submitButton.classList.remove("disabledPointer");
        }
        else {
            this.submitButton.classList.add("disabledPointer");
        }
    }
    validateWord(wordInput) {
        if (wordInput.validity.patternMismatch || wordInput.value == "") {
            wordInput.classList.add("is-primary");
            wordInput.classList.remove("is-danger");
            return true;
        }
        else {
            wordInput.classList.add("is-danger");
            wordInput.classList.remove("is-primary");
            return false;
        }
    }
    translationValues() {
        const values = [];
        this.translations.forEach(element => values.push(element.value));
        return values;
    }
    validateWords() {
        const validations = [];
        validations.push(this.validateWord(this.sourceWord));
        if (this.translations) {
            this.translations.forEach(element => {
                validations.push(this.validateWord(element));
            });
        }
        return !validations.includes(false);
    }
}
class CreateDeckModal extends CardModal {
    constructor(id) {
        super(id);
        if (this.modal) {
            this.addClickEventToSelector(`.add-card`, this.addCardToDeck);
        }
    }
    addCardToDeck() {
        if (this.sourceWord) {
            const card = new BaseCard(this.id, this.sourceWord.value, this.translationValues(), this.sourceLanguage.value, this.targetLanguage.value, this.recorder.clip);
            this.deck.push(card);
            this.clear();
        }
    }
    submit() {
    }
}
class EditCardModal extends CardModal {
    constructor(id) {
        super(id);
        this.buildTranslationInputList();
    }
    buildTranslationInputList() {
        const translationinputs = this.nullCheckedQuerySelectorAll(".translation");
        if (translationinputs)
            translationinputs.forEach(element => {
                const template = document.querySelector('.translation-template');
                element.addEventListener('click', (e) => {
                    if (template && 'content' in document.createElement('template')) {
                        const translationsBlock = this.nullCheckedQuerySelector('.translation-block');
                        if (translationsBlock) {
                            const clone = template.content.cloneNode(true);
                            translationsBlock.appendChild(clone);
                            const removeButton = clone.querySelector(".remove-translation");
                            if (removeButton) {
                                removeButton.addEventListener('click', (e) => {
                                    var _a, _b;
                                    const clicked = e.target;
                                    (_b = (_a = clicked === null || clicked === void 0 ? void 0 : clicked.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.remove();
                                });
                            }
                        }
                        else {
                            logError(`translation-block not found in ${this.id}`);
                        }
                    }
                    else {
                        console.log("Cant't add");
                    }
                });
            });
    }
    openModal() {
        super.openModal();
        if (this.sourceLanguage && this.targetLanguage && this.sourceWord && this.translations.length > 0) {
            this.sourceLanguage.value = this.card.sourceLanguage;
            this.targetLanguage.value = this.card.targetLanguage;
            this.sourceWord.value = this.card.sourceLanguage;
            for (let i = 0; i > this.translations.length; i++) {
                this.translations[i].value = this.card.translations[i];
            }
        }
    }
    populateCard(card) {
        this.card = card;
        if (this.sourceLanguage && this.targetLanguage && this.sourceWord && this.translations.length > 0) {
            this.sourceLanguage.value = card.sourceLanguage;
            this.targetLanguage.value = card.targetLanguage;
            this.sourceWord.value = card.sourceLanguage;
            for (let i = 0; i > this.translations.length; i++) {
                this.translations[i].value = card.translations[i];
            }
        }
    }
    submit() {
        Server.postEdit(this.card);
    }
}
class FetchDeckModal extends Modal {
    constructor(id) {
        super(id);
        this.count = this.nullCheckedQuerySelector(".count");
    }
    validateCount() {
        const number = parseInt(this.count.value);
        return (number <= 10 && number > 0);
    }
    submit() {
        this.fetchDeck();
    }
    validateForSubmit() {
        if (this.validateLanguages() && this.validateCount()) {
            this.submitButton.classList.remove("disabledPointer");
        }
        else {
            this.submitButton.classList.add("disabledPointer");
        }
    }
    fetchDeck() {
        return __awaiter(this, void 0, void 0, function* () {
            const jsonDeck = yield Server.getDeck(this.count.value, this.sourceLanguage.value, this.targetLanguage.value);
            console.log(jsonDeck);
        });
    }
}
class FetchTableModal extends Modal {
    submit() {
        Server.goToTable(this.sourceLanguage.value, this.targetLanguage.value);
    }
    validateForSubmit() {
        if (this.validateLanguages()) {
            this.submitButton.classList.remove("disabledPointer");
        }
        else {
            this.submitButton.classList.add("disabledPointer");
        }
    }
}
var _Ui_instances, _Ui_getDeck;
class Ui {
    constructor() {
        _Ui_instances.add(this);
        this.fetchDeckModal = new FetchDeckModal("#draw-deck-modal");
        this.fetchTableModal = new FetchTableModal("#choose-language-modal");
        this.editModal = new EditCardModal("#edit-card-modal");
        this.createDeckModal = new CreateDeckModal("#create-deck-modal");
        const previousDeck = __classPrivateFieldGet(this, _Ui_instances, "m", _Ui_getDeck).call(this);
        const user = localStorage.getItem('current_user');
        if (previousDeck) {
            this.deck = previousDeck;
        }
        else {
        }
        this.addClickEventToSelector("#open-edit-card-modal", () => {
            this.editModal.populateCard(this.currentCard);
            this.editModal.openModal();
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
    }
    shuffle() {
    }
}
_Ui_instances = new WeakSet(), _Ui_getDeck = function _Ui_getDeck() {
    const json = localStorage.getItem("deck");
    if (json && json != "{}") {
        const localDeck = JSON.parse(json);
        return localDeck.map(element => new PlayingCard(element["id"], element["source_word"], element["translations"], element["source_language"], element["target_language"], element["audio"]));
    }
};
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
            editUrl.pathname = "upload_deck";
            const formData = new FormData();
            formData.append("source_word", card.sourceWord);
            formData.append("translations", JSON.stringify(card.translations));
            formData.append("file", card.audio, card.sourceWord);
            const response = yield fetch(editUrl, { method: 'POST', body: formData });
            if (!response.ok) {
                logError(`Could not submit edit: ${response.status}`);
            }
        });
    }
    static getValidLanguages() {
        return __awaiter(this, void 0, void 0, function* () {
            const languagesURL = new URL(this.baseURL);
            languagesURL.pathname = "get_languages";
            const response = yield fetch(languagesURL);
            if (response.ok) {
                return yield response.json();
            }
            else {
                logError(`Could not get languages: ${response.status}`);
                return [];
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
                formData.append("translations", JSON.stringify(card.translations));
                formData.append("audio", card.audio);
            });
            const response = yield fetch(uploadURL, { method: 'POST', body: formData });
            if (!response.ok) {
                logError(`Could not upload deck: ${response.status}`);
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
            return response.json();
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
            const response = yield fetch(tableURL);
            if (!response.ok) {
                logError(`Could not get table: ${response.status}`);
            }
        });
    }
}
_a = Server;
Server.baseURL = "http://127.0.0.1:8000/";
Server.validLangauges = _a.getValidLanguages();
function logError(message) {
    if (LOGGING)
        console.error(message);
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
}
var _PlayingCard_incorrectCount, _PlayingCard_correctCount, _PlayingCard_difficulty;
class PlayingCard extends BaseCard {
    constructor(id, sourceWord, translations, sourceLanguage, targetLanguage, audio) {
        super(id, sourceWord, translations, sourceLanguage, targetLanguage, audio);
        _PlayingCard_incorrectCount.set(this, void 0);
        _PlayingCard_correctCount.set(this, void 0);
        _PlayingCard_difficulty.set(this, void 0);
        __classPrivateFieldSet(this, _PlayingCard_incorrectCount, this.incorrectCount, "f");
        __classPrivateFieldSet(this, _PlayingCard_correctCount, this.correctCount, "f");
        __classPrivateFieldSet(this, _PlayingCard_difficulty, this.difficulty, "f");
    }
    get incorrectCount() {
        return __classPrivateFieldGet(this, _PlayingCard_incorrectCount, "f");
    }
    get correctCount() {
        return __classPrivateFieldGet(this, _PlayingCard_correctCount, "f");
    }
    get difficulty() {
        return __classPrivateFieldGet(this, _PlayingCard_difficulty, "f");
    }
    updateLocalScore(score) {
        __classPrivateFieldSet(this, _PlayingCard_correctCount, __classPrivateFieldGet(this, _PlayingCard_correctCount, "f") + score, "f");
    }
    serialiseData() {
        return JSON.stringify({
            id: this.id,
            sourceWord: this.sourceWord,
            translations: this.translations
        });
    }
}
_PlayingCard_incorrectCount = new WeakMap(), _PlayingCard_correctCount = new WeakMap(), _PlayingCard_difficulty = new WeakMap();
//# sourceMappingURL=test.js.map