import { NodeType } from "../../constants/NodeTypes.js";
import { TokenTypes } from "../tokenizer/TokenTypes.js";

export class Parser {
  constructor(tokenizer) {
    this._tokenizer = tokenizer;
    this._lookahead = null;
  }

  init() {
    this._lookahead = this._tokenizer.getNextToken();
  }

  parseProgram() {
    this._eat("scene shuru");

    const body = [];

    while (this._lookahead && this._lookahead.type !== "scene khatam") {
        console.log("Test 2 passed")
        // console.log(this)
      body.push(this.parseStatement());
    }

    this._eat("scene khatam");

    return {
      type: NodeType.Program,
      body,
    };
  }

  parseStatement() {

    switch (this._lookahead.type) {
      case TokenTypes.BOL:
        return this.parsePrintStatement();

      case TokenTypes.YAAD_RAKH:
        return this.parseVariableDeclaration();

      default:
        throw new SyntaxError(`Unexpected token: ${this._lookahead.type}`);
      
    }

  }

  parsePrintStatement() {
    this._eat("BOL");

    const valueToken = this._eat(TokenTypes.STRING_TYPE);

    this._eat(TokenTypes.SEMI_COLON_TYPE);

    return {
      type: NodeType.PrintStatement,
      argument: {
        type: NodeType.StringLiteral,
        value: valueToken.value.slice(1, -1), // remove surrounding quotes
      },
    };
  }

  // parseVariableDeclaration() {

  //   this._eat(TokenTypes.YAAD_RAKH);

  //   const variableNameToken = this._eat(TokenTypes.IDENTIFIER_TYPE);

  //   this._eat(TokenTypes.ASSIGN_TYPE);



  // }






  _eat(tokenType) {
    const token = this._lookahead;

    if (token === null || token.type.toLowerCase() !== tokenType.toLowerCase()) {
      throw new SyntaxError(`Expected token: ${tokenType}, got ${token?.type}`);
    }

    this._lookahead = this._tokenizer.getNextToken();
    return token;
  }
}
