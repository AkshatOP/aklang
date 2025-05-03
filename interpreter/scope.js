// import RuntimeException from "../exceptions/runtimeException";


export default class Scope {

  constructor(parentScope) {
    this._variables = new Map();
    this._isLoop = false;
    this._isBreakStatement = false;
    this._isContinueStatement = false;
    this._parentScope = parentScope;
  }

  isLoop() {
    return this._isLoop;
  }

  setLoop(isLoop) {
    this._isLoop = isLoop;
  }

  setBreakStatement(isBreakStatement) {
    this._isBreakStatement = isBreakStatement;
  }

  setContinueStatement(isContinueStatement) {
    this._isContinueStatement = isContinueStatement;
  }

  isBreakStatement() {
    return this._isBreakStatement;
  }

  isContinueStatement() {
    return this._isContinueStatement;
  }

  get(identifier) {
    if (this._variables.has(identifier)) {
      return this._variables.get(identifier);
    }

    if (this._parentScope !== null) {
      return this._parentScope.get(identifier);
    }

    throw new RuntimeException(`Variable "${identifier}" bana to le pehle.`);
  }

  assign(identifier, value) {
    if (this._variables.has(identifier)) {
      this._variables.set(identifier, value);
      return;
    }

    if (this._parentScope !== null) {
      this._parentScope.assign(identifier, value);
      return;
    }

    throw new RuntimeException(
      `Variable "${identifier}" bana to le pehle fir assign karna.`
    );
  }

  declare(identifier, value) {
    if (this._variables.has(identifier)) {
      throw new RuntimeException(
        `Variable "${identifier}" pehle se exist karta hai bhai. Check karle.`
      );
    }

    this._variables.set(identifier, value);
  }
}
