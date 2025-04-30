import { NodeType } from "../../constants/NodeTypes.js";
import { TokenTypes } from "../tokenizer/TokenTypes.js";
// import Expression from "./expression";

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
        // console.log("Test 2 passed")
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
        return this.expressionStatement();
        //throw new SyntaxError(`Unexpected token: ${this._lookahead.type}`);
      
    }

  }


  //Print statement

  parsePrintStatement() {
    this._eat(TokenTypes.BOL);

    console.log(this._lookahead);
    // const valueToken = this._eat(TokenTypes.STRING_TYPE);
    const expressions = this.parseExpressionList();

    this._eat(TokenTypes.SEMI_COLON_TYPE);

    return {
      type: NodeType.PrintStatement,
      expressions: expressions,
    };

  }

  //Variable Declaration

  parseVariableDeclaration() {

    this._eat(TokenTypes.YAAD_RAKH);
    const declarations = this._getVariableDeclarationList();
    this._eat(TokenTypes.SEMI_COLON_TYPE);

    return {
      type: NodeType.VariableStatement,
      declarations
    }

  }

  _getVariableDeclarationList() {
    const variableDecalrations = [];

    do {
      variableDecalrations.push(this._getVariableDeclaration());
    } while (
      this._lookahead?.type === TokenTypes.COMMA_TYPE &&
      this._eat(TokenTypes.COMMA_TYPE)
    );

    return variableDecalrations
  }


  _getVariableDeclaration() {
    const id = this._eat(TokenTypes.IDENTIFIER_TYPE);

    
    let init;
    if (this._lookahead?.type === TokenTypes.SIMPLE_ASSIGN_TYPE) {
        this._eat(TokenTypes.SIMPLE_ASSIGN_TYPE);
        init = this.parseExpression(); // Parse the initializer expression
    } else {
      init = this._getNullLiteral();
    }


    return {
        type: NodeType.VariableDeclaration,
        id: {
            type: NodeType.IdentifierExpression,
            name: id.value,
        },
        init,
    };
  }

  _getNullLiteral() {
    return {
      type: NodeType.NullLiteral,
      value: null,
    };
  }


  //Expression Statement

  expressionStatement() {
    const left = this._parsePrimaryExpression();

    let init;
    let operator;
    if (this._lookahead?.type === TokenTypes.SIMPLE_ASSIGN_TYPE || this._lookahead?.type === TokenTypes.COMPLEX_ASSIGN_TYPE) {
       operator = this._eat(this._lookahead.type); // Eat the assignment operator
      init = this.parseExpression(); // Parse the initializer expression
    }
    this._eat(TokenTypes.SEMI_COLON_TYPE);

    return {
      type: NodeType.ExpressionStatement,
      operator: operator?.value,
      expression: init,
    }

  }


  //Parse Expression

  parseExpressionList() {
    const ExpressionList = [];

    do {
      ExpressionList.push(this.parseExpression());
    } while (
      this._lookahead?.type === TokenTypes.COMMA_TYPE &&
      this._eat(TokenTypes.COMMA_TYPE)
    );

    return ExpressionList
  }

  parseExpression() {
    return this.parseAssignmentExpression();
  }


  parseAssignmentExpression() { 
    const left = this.parseBinaryExpression();
    return left;
  }


  parseBinaryExpression() {
    let left = this._parsePrimaryExpression();
    
    while (this._isBinaryOperator(this._lookahead?.type)) {
      
      const operator = this._eat(this._lookahead.type);
      
      const right = this._parsePrimaryExpression();
  
      left = {
        type: NodeType.BinaryExpression,
        operator: operator.value,
        left,
        right,
      };
    }

    return left;


  }

  _parsePrimaryExpression() {
    const token = this._lookahead;

    if(token.type === TokenTypes.STRING_TYPE) {
      return this.parseString();
    }

    if(token.type === TokenTypes.IDENTIFIER_TYPE){
      return this.parseIdentifier();
    }

    if(token.type === TokenTypes.NUMBER_TYPE){
      return this.parseLiteral();
    }

    throw new SyntaxError(`Unexpected token in primary expression: ${token.type}`)


  }


  parseIdentifier() {
    const token = this._eat(TokenTypes.IDENTIFIER_TYPE);
    return {
      type: NodeType.IdentifierExpression,
      name: token.value,
    };
  }

  parseString() {
    const token = this._eat(TokenTypes.STRING_TYPE);
    return {
      type: NodeType.StringLiteral,
      name: token.value.slice(1, -1), // remove surrounding quotes
    };
  }
  
  parseLiteral() {
    const token = this._eat(TokenTypes.NUMBER_TYPE);
    return {
      type: NodeType.NumericLiteral,
      value: Number(token.value),
    };
  }
  
  _isBinaryOperator(type) {
    return [TokenTypes.ADDITIVE_OPERATOR_TYPE,TokenTypes.MULTIPLICATIVE_OPERATOR_TYPE].includes(type);
  }








  _eat(tokenType) {
    const token = this._lookahead;

    if (token === null || token.type.toLowerCase() !== tokenType.toLowerCase()) {
      throw new SyntaxError(`Expected token: ${tokenType}, got ${token?.type}`);
    }

    this._lookahead = this._tokenizer.getNextToken();
    return token;
  }
}
