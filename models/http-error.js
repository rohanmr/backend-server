class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // Addes a message property
    this.code = errorCode; // Addes a code property
  }
}

module.exports = HttpError;
