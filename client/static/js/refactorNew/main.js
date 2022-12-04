const LOGGING = true; // if true, log errors
console.info(`Logging: ${LOGGING}`)

try {
    const UI = new UI(); 
} catch (exception) {
    logError("Failed to create UI");
    logError(exception);
}

