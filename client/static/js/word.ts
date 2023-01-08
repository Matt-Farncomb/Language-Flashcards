class Word {
    word: string; 
    id: number | null;
    language: string | null;
    parent: number | null;

    constructor(word: string, id: number | null=null, language: string | null=null, parent: number | null=null) {
        this.word = word;
        this.id = id;
        this.language = language;
        this.parent = parent;
    }
}