export default class InvalidStateException extends Error {
  constructor(errorMessage) {
    super(errorMessage);
    this.name = "InvalidStateException";
    this.message = errorMessage;
  }
}
