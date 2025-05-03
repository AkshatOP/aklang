export default class NullPointerException extends Error {
  constructor(errorMessage) {
    const errorName = "NullPointerException";
    errorMessage = errorName + ": " + errorMessage;
    super(errorMessage);
    this.name = errorName;
    this.message = errorMessage;
  }
}
