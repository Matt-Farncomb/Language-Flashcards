
class UI {

    #deck;
    #front;
    #back;
    #card;
    #baseDeck;

    #loggedIn;
    #server;
    #deckSize;

    #currentCustomCard;
    #deckToDraw;
    #audio;

    #isCustomDeck;

    constructor(deck, server, deckSize) {
        this.#loggedIn = this.#loggedInFunc();
        this.#deck = deck;
        this.#server = server;
        this.#deckSize = deckSize;
        this.#baseDeck = null;
        this.#currentCustomCard = null;
        this.#deckToDraw = null;
        this.#audio = new Audio();
        this.#isCustomDeck = true;

        document.querySelector("#user-sl").innerText = localStorage.getItem('source_language', 'lang');
        document.querySelector("#user-tl").innerText = localStorage.getItem('target_language', 'lang'); 

        document.querySelectorAll(".source-language-input").forEach((e) => {
            e.addEventListener('click', () => { 
                if (e.value == localStorage.getItem('source_language', 'lang')) e.value = "";
            } );

        })

        document.querySelectorAll(".target-language-input").forEach((e) => {
            e.addEventListener('click', () => { 
                if (e.value == localStorage.getItem('target_language', 'lang')) e.value = "";
            } );
        })

        const translationinputs = document.querySelectorAll(".add-translation-fart");
        translationinputs.forEach(element => {
            element.addEventListener('click', (e) => {
                console.log("Will try to add");
                if ('content' in document.createElement('template')) {
                    const translationsBlock = e.target.parentElement.parentElement.parentElement.parentElement;
                    console.log(translationsBlock);
                    const template = document.querySelector('.translation-template');
                    const clone = template.content.cloneNode(true);

                    clone.querySelector(".remove-translation").addEventListener(
                        'click' , (e) => e.target.parentElement.parentElement.remove() );

                        translationsBlock.appendChild(clone); 
                } else {
                    console.log("Cant't add");
                }
            })
        })

       
     
        //Server Cards
        this.#whenClicked("#choose-language", () => this.chooseLanguages());
        this.#whenClicked("#draw-deck", () => this.login());
        this.#whenClicked("#new-deck", () => this.#revealDeckForm());
        this.#whenClicked("#test2", () => this.#revealChooseLanguage());
        this.#whenClicked(".close-choose-language-modal", () => this.#hideChooseLanguage());
        this.#whenClicked(".close-deck-modal", () => this.#revealDeckForm());
        this.#whenClicked(".close-update-server-modal", () => this.#hideUpdateServer());
        this.#whenClicked("#front-flip", () => this.#slowFlip());
        this.#whenClicked("#back-flip", () => this.#slowFlip());
        this.#whenClicked(".back-flip", () => this.#quickFlip());
        // this.#whenClicked("#new-card", () => this.#drawCard()); 
        this.#whenClicked(".new-card", () => this.#drawCard()); 
        this.#whenClicked("#logout", () => this.logout());    
        this.#whenClicked("#submit-result", () => this.#server.submitResult(this.#deck));  
        // this.#whenClicked("#update-server", () => this.#server.refresh());
        this.#whenClicked("#update-server", () => this.#revealUpdateServer());
        this.#whenClicked("#run-update-server", () => this.#refreshServer());
        this.#whenClicked("#submit-answer", () => this.#checkAnswer()); 
        //Creating new cards
        this.#whenClicked(".edit", () => this.#revealEditForm());

        this.#whenClicked("#create", () => this.#revealCardForm());
        this.#whenClicked(".close-create-modal", () => this.#hideHardForm() );
        this.#whenClicked(".close-edit-modal", () => this.#hideEditForm() );
        this.#whenClicked("#clear", () => this.#clearCardForm());
        this.#whenClicked("#clear-edit", () => this.#clearEditCardForm());
        this.#whenClicked("#upload", () => this.#server.uploadDeck(this.#baseDeck));
        this.#whenClicked("#add", () => this.#getCardForUpload());

        // this.#whenClicked(".add-translation-fart", () => this.#addTranslation());

        

 

        this.#whenClicked("#play-word", () => this.playAudio());

        this.#toggleWhenClicked(".toggle-is-light");

        this.#validateLanguageOnChange('source');
        this.#validateLanguageOnChange('translation');
        this.#validateWordOnChange('source');
        this.#validateWordOnChange('translation');

        this.#validateDrawCardOnChange("deck-size");
        this.#validateDrawCardOnChange("source-language");
        this.#validateDrawCardOnChange("translation-language");

        this.#validateChooseLanguageOnChange("#choose-source-language");
        this.#validateChooseLanguageOnChange("#choose-translation-language");

        this.#validateUpdateServerOnChange("#update-source-language");
        this.#validateUpdateServerOnChange("#update-translation-language");
        
    }

    #AutoFillLanguages() {
        document.querySelectorAll(".source-language-input").forEach((e) => {
            e.value = localStorage.getItem('source_language', 'lang');

        })

        document.querySelectorAll(".target-language-input").forEach((e) => {
            e.value = localStorage.getItem('target_language', 'lang');
        })
    }

    async playAudio() {
        // this.#audio.src = await this.#card.audio;
        this.#audio.src = await this.#card.audio;
        this.#audio.play();
    }

    async readyToUpload() {
        const test = await this.#currentCustomCard.readyToUpload(this.#deck);
        console.log(test);
        if (test) {
            this.enableAddCard();
        } else {
            this.disableAddCard();
        }
    }

    #revealEditForm() {
        this.#revealEditModal();
        const translations_needed = this.#back.length;
        const source = document.querySelector("#edit-source");
        const translation = document.querySelector("#edit-translation");
        if (this.#front)  source.value = this.#front.word;
        if (this.#back) translation.value = this.#back[0].word;
        for (let i = 1; i < translations_needed; i++) {
            this.#addTranslationWithContent(this.#back[i].word);
        }   
    }

    
    
    // #addTranslation() {
    //     // const translationinputs = document.querySelectorAll(".add-translation-fart");
    //     // translationinputs.forEach(element => {
    //     //     element.addEventListener('click', (e) => {
    //     //         console.log("Will try to add");
    //     //         if ('content' in document.createElement('template')) {
    //     //             const parent = e.target.parentElement.parentElement.parentElement;
    //     //             const template = document.querySelector('.translation-template');
    //     //             const clone = template.content.cloneNode(true);

    //     //             clone.querySelector(".remove-translation").addEventListener(
    //     //                 'click' , (e) => e.target.parentElement.parentElement.remove() );

    //     //             previousRow.appendChild(clone); 
    //     //         } else {
    //     //             console.log("Cant't add");
    //     //         }
    //     //     })
    //     // })

    //     console.log("Will try to add");
    //     // Test to see if the browser supports the HTML template element by checking
    //     // for the presence of the template element's content attribute.
    //     if ('content' in document.createElement('template')) {
    //         // Instantiate the table with the existing HTML tbody
    //         // and the row with the template
    //         console.log("Adding");
    //         const previousRow = document.querySelector("#add-translations-block");
    //         const template = document.querySelector('.translation-template');

    //         // Clone the new row and insert it into the table   
    //         const clone = template.content.cloneNode(true);
    //         clone.querySelector(".remove-translation").addEventListener(
    //             'click' , (e) => e.target.parentElement.parentElement.remove() );

    //         previousRow.appendChild(clone);    
    //     } else {
    //         console.log("Cant't add");
    //     }
    // }

    #addTranslationWithContent(content) {
        console.log("Will try to add");
        // Test to see if the browser supports the HTML template element by checking
        // for the presence of the template element's content attribute.
        if ('content' in document.createElement('template')) {
            // Instantiate the table with the existing HTML tbody
            // and the row with the template
            console.log("Adding");
            const previousRow = document.querySelector("#add-translations-block");
            const template = document.querySelector('#add-translation-template');

            // Clone the new row and insert it into the table   
            const clone = template.content.cloneNode(true);
            clone.value = content;
            clone.querySelector(".remove-translation").addEventListener(
                'click' , (e) => e.target.parentElement.parentElement.remove() );
            
            
            previousRow.appendChild(clone);    
        } else {
            console.log("Cant't add");
        }
    }

    async #readyToDraw() {
        const test = await this.#deckToDraw.readyToDraw();
        console.log(test);
        if (test) {
            document.querySelector("#draw-deck").classList.remove("disabledPointer"); 
            document.querySelector("#draw-deck").classList.add("is-success");
        } else {
            document.querySelector("#draw-deck").classList.add("disabledPointer"); 
            document.querySelector("#draw-deck").classList.remove("is-success");
        }
    }
    async #validChooseLanguage() {
        const valid = await this.#deckToDraw.validChooseLanguage();
        console.log(valid);
        if (valid) {
            document.querySelector("#choose-language").classList.remove("disabledPointer"); 
            document.querySelector("#choose-language").classList.add("is-success");
        } else {
            document.querySelector("#choose-language").classList.add("disabledPointer"); 
            document.querySelector("#choose-language").classList.remove("is-success");
        }
    }

    #toggleIsLight(buttons){
        this.#isCustomDeck = !this.#isCustomDeck;
        console.log(this.#isCustomDeck);
        buttons.forEach(element => {
            element.classList.toggle("is-light");
        });
    }

    #changeInputUIIfInvalid(languageType) {
        // const selector = document.querySelector(`${languageType}-language`);
        const validLanguage = data.includes(selector.value)
        if (validLanguage){
            selector.classList.add("is-primary");
            selector.classList.remove("is-danger");
        } else if (!validLanguage && selector.value != "") {
            selector.classList.remove("is-primary");
            selector.classList.add("is-danger");
        }
    }

    // async #readyToDraw() {
    //     const data = await this.#server.languages
    //     const scource = document.querySelector("source-language").value;
        
    //     return data.includes(scource) && data.includes(translation)     
    // }

    disableAddCard() {
        document.querySelector("#add").classList.add("disabledPointer");    
        document.querySelector("#add").classList.remove("is-success");
        if (this.#baseDeck == null) {
            document.querySelector("#upload").classList.add("disabledPointer");
        } 
    }

    disableUpdateCard() {
        document.querySelector("#update").classList.add("disabledPointer");    
        document.querySelector("#update").classList.remove("is-success");
    }

    enableAddCard() {
        document.querySelector("#add").classList.remove("disabledPointer"); 
        document.querySelector("#add").classList.add("is-success");
        if (this.#baseDeck != null) {
            document.querySelector("#upload").classList.remove("disabledPointer");
        }
    }

    enableUpdateCard() {
        document.querySelector("#update").classList.remove("disabledPointer"); 
        document.querySelector("#update").classList.add("is-success");
    }

 

    isValidLanguage(language) {
        const languageList = document.querySelector("#languages").options;
        for (var e of languageList) {
            if (e.value === language) {
                console.log(e);
                return true;
            }
        }
        return false;

    }

    
    async #validateChooseLanguageOnChange(id) {

        const selector = document.querySelector(`${id}`);
    
        selector.onchange = (e) => {
            this.#updateChooseLanguageModal();
        }
    }

    async #validateUpdateServerOnChange(id) {

        const selector = document.querySelector(`${id}`);
    
        selector.onchange = (e) => {
            this.#updateUpdateServerModal();
        }
    }

    async #validateDrawCardOnChange(input) {
        const selector = document.querySelector(`#${input}`);
        selector.onchange = (e) => {
            this.#readyToDraw();
        }
    }

    async #validateLanguageOnChange(id) {
        const input = document.querySelector(`#add-${id}-language`);
        input.onchange = (e) => {
            this.#currentCustomCard.isThisLanguageValid(id);
            this.readyToUpload();
        }
    }

    #validateWordOnChange(id) {
        const input = document.querySelector(`#add-${id}`);
        input.onchange = (e) => {
            this.#currentCustomCard.wordIsReady(input);
            this.readyToUpload();
        } 
        
    }

    #toggleLanguageLock(status) {
        document.querySelector("#add-source-language").disabled = status;
        document.querySelector("#add-translation-language").disabled = status;
    }

    #clearCardForm() {
        const inputs = document.querySelectorAll("#new-card-modal input");
        inputs.forEach(input => {
            input.value = "";
            input.classList.remove("is-primary", "is-danger");
        });
        this.disableAddCard();
        this.#toggleLanguageLock(false);
        // this.#baseDeck = null;
    }

    #clearEditCardForm() {
        const inputs = document.querySelectorAll("#edit-card-modal input");
        inputs.forEach(input => {
            input.value = "";
            input.classList.remove("is-primary", "is-danger");
        });
        this.disableUpdateCard();
    }

    #clearWords() {
        document.querySelector("#add-source").value = "";
        document.querySelector("#add-source").classList.remove("is-primary", "is-danger");
        document.querySelector("#add-translation").value = "";
        document.querySelector("#add-translation").classList.remove("is-primary", "is-danger");
        this.readyToUpload();
    }

    #getCardForUpload() {
        
        if (this.#baseDeck == null) {
            
            this.#baseDeck = new BaseDeck(
                this.#currentCustomCard.sourceLanguage, this.#currentCustomCard.targetLanguage
            );
            this.#toggleLanguageLock(true);
        }
        console.log(this.#currentCustomCard.audio);
        const card = new BaseCard(this.#currentCustomCard.word, this.#currentCustomCard.translation, this.#currentCustomCard.audio);
        console.log(card);
        this.#baseDeck.addCard(card);
        this.#clearWords();
        if (this.#baseDeck != null)  {
            document.querySelector("#upload").classList.remove("disabledPointer");
        }

        
    }

    chooseLanguages(event) {
        console.log("choosing languages");
   
        // event.preventDefault();
        let source_language = document.querySelector("#choose-source-language");
        let target_language = document.querySelector("#choose-translation-language");
        localStorage.setItem('source_language', source_language.value);
        localStorage.setItem('target_language', target_language.value);
        this.#updateDisplayedLanguages();
        // document.querySelector("#new-card").innerText = "Play";
        // this.reveal();
    }


    login(event) {
        console.log("fart");
   
        // event.preventDefault();
        let source_language = document.querySelector("#source-language");
        let target_language = document.querySelector("#translation-language");
        localStorage.setItem('source_language', source_language.value);
        localStorage.setItem('target_language', target_language.value);
        this.#updateDisplayedLanguages();
        this.#newDeck();
        // document.querySelector("#new-card").innerText = "Play";
        // this.reveal();
    }

    #revealDeckForm() {
        document.querySelector("#deck-modal").classList.toggle("is-active");
        this.#deckToDraw = new DrawDeck(this.#server);
        this.#AutoFillLanguages();
    }

    #revealCardForm() {
        this.#baseDeck = null;
        const createCardModal = "#new-card-modal"
        // if (this.#baseDeck != null) console.log(this.#baseDeck);
        this.#currentCustomCard = new CustomCard(this.#server, this, createCardModal);
        //this.readyToUpload();
        this.disableAddCard();
        document.querySelector(createCardModal).classList.toggle("is-active");
        this.#clearCardForm();
        this.#AutoFillLanguages();
    }

    #revealEditModal() {
        this.#baseDeck = null;
        const editCardModal = "#edit-card-modal"
        // if (this.#baseDeck != null) console.log(this.#baseDeck);
        this.#currentCustomCard = new CustomCard(this.#server, this, editCardModal);
        //this.readyToUpload();
        this.disableUpdateCard();
        document.querySelector(editCardModal).classList.toggle("is-active");
        // this.#clearEditCardForm();
        this.#AutoFillLanguages();
    }

    #hideChooseLanguage() {
        console.log("Hiding Choose language");
        document.querySelector("#choose-language-modal").classList.toggle("is-active");
    }

    #hideUpdateServer() {
        console.log("Hiding Update Server");
        document.querySelector("#update-server-modal").classList.toggle("is-active");
    }

    #revealChooseLanguage() {
        console.log("Revealing Choose language");
        document.querySelector("#choose-language-modal").classList.toggle("is-active");
        this.#AutoFillLanguages();
        this.#updateChooseLanguageModal();
    }

    #revealUpdateServer() {
        console.log("Revealing Update Server");
        document.querySelector("#update-server-modal").classList.toggle("is-active");
        this.#AutoFillLanguages();
        this.#updateUpdateServerModal();
    }

    #updateUpdateServerModal() {

        function updateInputs(selector, noDuplicates, validLanguage) {
            if (noDuplicates && validLanguage) {
                selector.classList.add("is-primary");
                selector.classList.remove("is-danger");
            } else if (!noDuplicates && selector.value != "") {
                selector.classList.remove("is-primary");
                selector.classList.add("is-danger");
            } else if (selector.value == "") {
                selector.classList.remove("is-primary");
                selector.classList.add("is-danger");
            }
            else {
                selector.classList.add("is-danger");
            }
        }

        const source = document.querySelector(`#update-source-language`);
        const translation = document.querySelector(`#update-translation-language`);

        const noDuplicates = document.querySelector(`#update-source-language`).value !== document.querySelector(`#update-translation-language`).value;
        const validSourceLanguage = this.isValidLanguage(source.value);
        const validTranslationLanguage = this.isValidLanguage(translation.value);

        updateInputs(source, noDuplicates, this.isValidLanguage(source.value));
        updateInputs(translation, noDuplicates, this.isValidLanguage(translation.value));

        if (noDuplicates && validSourceLanguage && validTranslationLanguage) {
            document.querySelector("#run-update-server").classList.remove("disabledPointer");

            localStorage.setItem('source_language', source.value);
            localStorage.setItem('target_language', translation.value);
            this.#updateDisplayedLanguages();
        }
        else document.querySelector("#run-update-server").classList.add("disabledPointer");

    }

    #updateChooseLanguageModal() {

        function updateInputs(selector, noDuplicates, validLanguage) {
            if (noDuplicates && validLanguage) {
                selector.classList.add("is-primary");
                selector.classList.remove("is-danger");
            } else if (!noDuplicates && selector.value != "") {
                selector.classList.remove("is-primary");
                selector.classList.add("is-danger");
            } else if (selector.value == "") {
                selector.classList.remove("is-primary");
                selector.classList.add("is-danger");
            }
            else {
                selector.classList.add("is-danger");
            }
        }

        const source = document.querySelector(`#choose-source-language`);
        const translation = document.querySelector(`#choose-translation-language`);

        const noDuplicates = document.querySelector(`#choose-source-language`).value !== document.querySelector(`#choose-translation-language`).value;
        const validSourceLanguage = this.isValidLanguage(source.value);
        const validTranslationLanguage = this.isValidLanguage(translation.value);

        updateInputs(source, noDuplicates, this.isValidLanguage(source.value));
        updateInputs(translation, noDuplicates, this.isValidLanguage(translation.value));

        if (noDuplicates && validSourceLanguage && validTranslationLanguage) {
            document.querySelector("#choose-language").classList.remove("disabledPointer");

            localStorage.setItem('source_language', source.value);
            localStorage.setItem('target_language', translation.value);
            this.#updateDisplayedLanguages();

            document.querySelector("#choose-language").onclick = () => location.href=`/table?source_language=${localStorage.getItem("source_language", "lang")}&target_language=${localStorage.getItem("target_language", "lang")}&is_custom=${this.#isCustomDeck}` 

        }
        else document.querySelector("#choose-language").classList.add("disabledPointer");

    }

    #hideHardForm() {
        this.disableAddCard();
        document.querySelector("#new-card-modal").classList.toggle("is-active");
        this.#clearCardForm();

        const newElements = document.querySelectorAll(".remove-translation");
        for (let i = 0; i < newElements.length; i++) {
            newElements[i].parentElement.parentElement.remove();
        }
          
    }

    #hideEditForm() {
        this.disableUpdateCard();
        document.querySelector("#edit-card-modal").classList.toggle("is-active");
        this.#clearEditCardForm();

        const newElements = document.querySelectorAll(".remove-translation");
        for (let i = 0; i < newElements.length; i++) {
            newElements[i].parentElement.parentElement.remove();
        }
          
    }

    #updateDisplayedLanguages() {
        document.querySelectorAll("#user-sl").innerText = localStorage.getItem('source_language', 'lang');
        document.querySelector("#user-tl").innerText = localStorage.getItem('target_language', 'lang');
        // document.querySelector("nav div a").href = `/table/sl=${localStorage.getItem("source_language", "lang")}?tl=${localStorage.getItem("source_language", "lang")}`
    }

    #whenClicked(id, func) {
        const button = document.querySelectorAll(`${id}`);
        button.forEach(element => {
            element.addEventListener('click', () => { 
                func()
            } );
        });
    }


    #toggleWhenClicked(id) {
        const button = document.querySelectorAll(`${id}`);
        button.forEach(element => {
            element.addEventListener('click', () => { 
                this.#toggleIsLight(button);
            } );

        });
    }

    #toggleWrong() {
        const answer = document.querySelector("#answer");
        const answerButton = document.querySelector("#submit-answer");
        answer.classList.add("has-background-danger-light");
        answerButton.classList.add("has-background-danger");
    }

    #toggleCorrect() {
        const answer = document.querySelector("#answer");
        const answerButton = document.querySelector("#submit-answer");
        answer.classList.remove("has-background-danger-light");
        answerButton.classList.remove("has-background-danger");
    }

    #checkAnswer() {
       
        const answer = document.querySelector("#answer");
        const input = answer.value;
        if (this.#card.isCorrectTranslation(input)) {
            console.log("Correct");
            this.#toggleCorrect();
            this.#server.submitResult(this.#card, true);
            // answer.classList.remove("has-background-danger-light");
            // answerButton.classList.remove("has-background-danger");
        } else {
             console.log("wrong"); 
             
             this.#toggleWrong();
             this.#server.submitResult(this.#card, false);
            //  answer.classList.add("has-background-danger-light");
            //  answerButton.classList.add("has-background-danger");

        }
    }

    #flipOverCard(time) {
        document.querySelector(".flip-card-inner").style.transition = `${time}s`;
        const inner = document.querySelector(".flip-card-inner");
        inner.classList.toggle("flip");
    }

    #slowFlip() {
        this.#flipOverCard(2);
    }

    #quickFlip() {
        this.#flipOverCard(0.25);
    }

    #drawCard() {
        console.log("fart two")
        document.querySelectorAll(".new-card").forEach(element => {
           element.innerText = "Next"; 
        });
        this.#card = this.#deck.randomCard();
        this.#front = this.#card.word;
        this.#back = this.#card.translations; 
        console.log(this.#card)
        console.log(this.#card.difficulty)
        document.querySelector("#difficulty").innerText = this.#card.difficulty;
        this.#toggleCorrect();
        this.#updateDisplay();
        document.querySelectorAll(".edit").forEach(element => element.classList.remove("disabledPointer"));
    }


    // reveal() {
    //     if (this.#loggedInFunc()) {
    //         console.log("logged in")
    //         const deck = document.querySelector("#deck");
    //         deck.classList.remove("hidden");
    //     }
    // }

   
    #loggedInFunc() {
        if (localStorage.getItem('source_language', 'lang')) {
            return true;
        }
        else return false;
    }

    logout() {
        localStorage.removeItem("source_language");
        localStorage.removeItem("target_language");
        const deck = document.querySelector("#deck");
        deck.classList.add("hidden");
        this.#loggedIn = false;
    }

    #updateDisplay() {
        this.#updateFace();
        this.#updateBack()
    }

    #updateFace() {
        const front = document.querySelector(".flip-card-front .card-content span");
        front.textContent = this.#front.word;
    }

    #updateBack() {
        const backWord = document.querySelector("#content-source-word");
        backWord.textContent = this.#front.word;
        const back = document.querySelector(".flip-card-back .card-content span");
        back.innerHTML = "";
        if (this.#back.length == 0) {
            const li = document.createElement("li");
            li.innerText = "No translations available";
            back.appendChild(li);
        }
        else {
            this.#back.forEach(element => {
                const li = document.createElement("div");
                li.innerText = element.word;
                back.appendChild(li);
            });
        }
        
    }

    #newDeck() {
        const deckSize = document.querySelector("#deck-size").value;
        this.#deck.getDeck(this.#server, deckSize, this.#isCustomDeck);
    
        document.querySelector("#new-card").disabled = false;
        // document.querySelector("#new-card").classList.remove("disabledPointer");

        document.querySelectorAll(".new-card").forEach((e) => {
                e.classList.remove("disabledPointer");
            })  
    }

    #refreshServer() {
        this.#server.refresh();
    }

}