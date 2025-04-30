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

  parseVariableDeclaration() {

    this._eat(TokenTypes.YAAD_RAKH);
    const declarations = this._getVariableDeclarationList();
    // console.log(declarations)
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
    // console.log(this)
    const id = this._eat(TokenTypes.IDENTIFIER_TYPE);
    // console.log(this._lookahead)

    
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

  parseExpression() {
    return this.parseAssignmentExpression();
  }


  parseAssignmentExpression() {
    
    const left = this._parsePrimaryExpression();


    // console.log("LOOKAHEAD " , this._lookahead)
    

    // if(this._lookahead?.type === TokenTypes.SIMPLE_ASSIGN_TYPE) {
      
    //   this._eat(TokenTypes.SIMPLE_ASSIGN_TYPE);
    //   // const right = this.parseBinaryExpression(); // Parse the right-hand side expression



    //   return {
    //     type: NodeType.AssignmentExpression,
    //     operator: '=',
    //     left,
    //     right,
    //   };
    // }

    return left;
    
  }


  parseBinaryExpression() {
    let left = this._parsePrimaryExpression();

    while (this._isBinaryOperator(this._lookahead()?.type)) {
      const operator = this._eat(this._lookahead().type);
      const right = this.parsePrimaryExpression();
  
      left = {
        type: NodeType.BinaryExpression,
        operator: operator.value,
        left,
        right,
      };
    }


  }

  _parsePrimaryExpression() {
    const token = this._lookahead;
    // console.log("TOKEN " , token)

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
  
  parseLiteral() {
    const token = this._eat(TokenTypes.NUMBER_TYPE);
    return {
      type: NodeType.NumericLiteral,
      value: Number(token.value),
    };
  }
  
  _isBinaryOperator(type) {
    return [TokenTypes.PLUS, TokenTypes.MINUS, TokenTypes.STAR, TokenTypes.SLASH].includes(type);
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
