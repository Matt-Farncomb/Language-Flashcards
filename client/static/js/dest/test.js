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
class Recorder {
    constructor(recorderDiv) {
        const recordButton = recorderDiv.querySelector(".record");
        if (recordButton) {
            this.recordButton = recordButton;
        }
        else {
            throw Error(`Class 'record' cannot be found in recorder`);
        }
    }
    get clip() {
        return this._clip;
    }
}
class Modal {
    constructor(id) {
        this._id = id;
        const modal = document.querySelector(`${id}`);
        const sourceLanguage = nullCheckedQuerySelector(modal, `.source-language`);
        const targetLanguage = nullCheckedQuerySelector(modal, `.translation-language`);
        if (modal && sourceLanguage && targetLanguage) {
            this._modal = modal;
            this.sourceLanguage = this.createNewInput(LanguageInput, sourceLanguage);
            this.targetLanguage = this.createNewInput(LanguageInput, targetLanguage);
            this.targetLanguage.addSibling(this.sourceLanguage);
            this.sourceLanguage.addSibling(this.targetLanguage);
            this.submitButton = this.nullCheckedButtonQuerySelector(`.submit`);
            this.addClickEventToModalElement(".submit", () => this.submit());
            this.addClickEventToModalElement(".clear", () => this.clear());
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
    updateInputValue(input, value) {
        input.value = value;
        input.dispatchEvent(new Event('change'));
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
    nullCheckedQuerySelectorAll(selector) {
        const elements = this.modal.querySelectorAll(selector);
        if (elements && elements.length > 0) {
            return elements;
        }
        else {
            throw new Error(`Cannot find ${selector} in ${this._id}`);
        }
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
    languageIsValid(languageInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const awaitedLanguages = yield Server.validLangauges;
            return awaitedLanguages.includes(languageInput.value) && this.notDuplicateLanguage();
        });
    }
    createNewInput(input, element) {
        const test = new input(element);
        test.addOnChangeEvent(() => console.log("farting!!!"));
        return test;
    }
    notDuplicateLanguage() {
        return this.sourceLanguage.value != this.targetLanguage.value;
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
    readyToSubmit() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.sourceLanguage.isValid()) && (yield this.targetLanguage.isValid());
        });
    }
}
class CardModal extends Modal {
    constructor(id) {
        super(id);
        this.translations = [];
        this.buildTranslationInputList();
        const sourceWord = nullCheckedQuerySelector(this.modal, `.source`);
        const translations = this.nullCheckedQuerySelectorAll(`.translation`);
        if (sourceWord && translations.length > 0) {
            this.sourceWord = this.createNewInput(WordInput, sourceWord);
            translations.forEach(inputElement => this.createNewInput(LanguageInput, inputElement));
            this.translations.forEach(wordInput => {
                wordInput.addSiblings(this.translations);
            });
        }
        else {
            throw Error(`Class 'source' or 'translation' could not be found in ${this.id}`);
        }
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
        return values;
    }
    buildTranslationInputList() {
        const translationinputs = this.nullCheckedQuerySelectorAll(".translation");
        if (translationinputs.length > 0)
            translationinputs.forEach(element => {
                if (element.parentElement) {
                    const addButton = element.parentElement.querySelector(".add-translation");
                    const template = document.querySelector('.translation-template');
                    if (addButton) {
                        addButton.addEventListener('click', (e) => {
                            if (template && 'content' in document.createElement('template')) {
                                const translationsBlock = nullCheckedQuerySelector(this.modal, '.translations-block');
                                if (translationsBlock) {
                                    const clone = template.content.cloneNode(true);
                                    translationsBlock.appendChild(clone);
                                    const lastTranslation = translationsBlock.lastElementChild;
                                    if (lastTranslation) {
                                        const newTranslation = lastTranslation.querySelector(".translation");
                                        if (newTranslation) {
                                            const newWordInput = this.createNewInput(WordInput, newTranslation);
                                            newWordInput.addSiblings(this.translations);
                                            this.translations.forEach(wordInput => wordInput.addSibling(newWordInput));
                                            this.translations.push(newWordInput);
                                            const removeButton = clone.querySelector(".remove-translation");
                                            if (removeButton) {
                                                removeButton.addEventListener('click', (e) => {
                                                    var _a, _b;
                                                    const clicked = e.target;
                                                    (_b = (_a = clicked === null || clicked === void 0 ? void 0 : clicked.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.remove();
                                                });
                                            }
                                        }
                                    }
                                }
                                else {
                                    logError(`translation-block not found in ${this.id}`);
                                }
                            }
                            else {
                                logError("Cant't add click event on plus icon");
                            }
                        });
                    }
                }
            });
    }
    allTranslationsAreValid() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let translation of this.translations) {
                if (!translation.isValid()) {
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
            return (yield _super.readyToSubmit.call(this)) && (yield this.sourceWord.isValid()) && this.allTranslationsAreValid();
        });
    }
}
class CreateDeckModal extends CardModal {
    constructor(id) {
        super(id);
        this.deck = [];
        if (this.modal) {
        }
    }
    submit() {
    }
}
class EditCardModal extends CardModal {
    constructor(id) {
        super(id);
    }
    openModal() {
        super.openModal();
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
        if (this.card) {
            Server.postEdit(this.card);
        }
    }
}
class FetchDeckModal extends Modal {
    constructor(id) {
        super(id);
        const count = nullCheckedQuerySelector(this.modal, ".count");
        if (count) {
            this.count = count;
        }
        else {
            throw Error(`Class 'count' cannot be found in ${this.id}`);
        }
    }
    validateCount() {
        const number = parseInt(this.count.value);
        return (number <= 10 && number > 0);
    }
    submit() {
        this.fetchDeck();
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
}
class Ui {
    constructor() {
        this.fetchDeckModal = new FetchDeckModal("#draw-deck-modal");
        this.fetchTableModal = new FetchTableModal("#choose-language-modal");
        this.editModal = new EditCardModal("#edit-card-modal");
        this.createDeckModal = new CreateDeckModal("#create-deck-modal");
        const previousDeck = this.getDeck();
        const user = localStorage.getItem('current_user');
        if (previousDeck) {
            this.deck = previousDeck;
        }
        else {
        }
        this.addClickEventToSelector("#open-edit-card-modal", () => {
            if (this.currentCard) {
                this.editModal.populateCard(this.currentCard);
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
    getDeck() {
        const json = localStorage.getItem("deck");
        if (json && json != "{}") {
            const localDeck = JSON.parse(json);
            return localDeck.map(element => new PlayingCard(element["id"], element["source_word"], element["translations"], element["source_language"], element["target_language"], element["audio"]));
        }
    }
}
class ExtendedInput {
    constructor(input) {
        this._htmlElement = input;
        this._siblings = [];
        this._htmlElement.oninput = () => this.validate();
        this._htmlElement.onchange = () => this.checkIfUnique();
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
    checkIfUnique() {
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
                    });
                }
            });
        }
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
                return JSON.parse(yield response.json());
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
//# sourceMappingURL=test.js.map