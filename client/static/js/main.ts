const LOGGING = true; // if true, log errors
console.info(`Logging: ${LOGGING}`)

const DEFAULT_LANGUAGES: LanguagePair = {
    "source": "Spanish",
    "target": "Finnish"
}

try {
    const ui = new Ui(); 
} catch (exception: any) {
    logError("Failed to create UI");
    logError(exception);
}

