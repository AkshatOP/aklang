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
    this._eat(TokenTypes.CLASS_CHALU);

    const body = [];

    while (this._lookahead && this._lookahead.type !== TokenTypes.CLASS_KHATAM) {
      body.push(this.parseStatement());
    }

    this._eat(TokenTypes.CLASS_KHATAM);

    return {
      type: NodeType.Program,
      body,
    };
  }

  parseStatement() {

    switch (this._lookahead.type) {
      case TokenTypes.BOL:
        return this.parsePrintStatement();

      case TokenTypes.BOL_ABHI:
        return this.parseSameLinePrintStatement();

      case TokenTypes.NOTE_KAR:
        return this.parseVariableDeclaration();

      case TokenTypes.PROXY_MILI_TOH:
        return this.parseIfStatement();
      
      case TokenTypes.JAB_TAK:
        return this.parseWhileStatement();

      case TokenTypes.BUNK_MAAR:
        return this.parseBreakStatement();

      case TokenTypes.AGLI_CLASS:
        return this.parseContinueStatement();

      case TokenTypes.SEMI_COLON_TYPE:
        return this.parseEmptyStatement();

      default:
        return this.expressionStatement();
      
    }

  }


  //Print statement

  parsePrintStatement() {
    this._eat(TokenTypes.BOL);

    const expressions = this.parseExpressionList();

    this._eat(TokenTypes.SEMI_COLON_TYPE);

    return {
      type: NodeType.PrintStatement,
      expressions: expressions,
    };

  }

  //Same line print statement

  parseSameLinePrintStatement() {
    this._eat(TokenTypes.BOL_ABHI);

    const expressions = this.parseExpressionList();

    this._eat(TokenTypes.SEMI_COLON_TYPE);

    return {
      type: NodeType.SameLinePrintStatement,
      expressions: expressions,
    };

  }

  //Variable Declaration

  parseVariableDeclaration() {

    this._eat(TokenTypes.NOTE_KAR);
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


  // While Statement

  parseWhileStatement() {
    this._eat(TokenTypes.JAB_TAK);
    this._eat(TokenTypes.OPEN_PARENTHESIS_TYPE);

    const test = this.parseBinaryRelationalExpression();
    this._eat(TokenTypes.CLOSED_PARENTHESIS_TYPE);

    const body = this.parseBlockStatement();

    return {
      type: NodeType.WhileStatement,
      test,
      body,
    };
  }

  // Break Statement

  parseBreakStatement() {
    this._eat(TokenTypes.BUNK_MAAR);


    return {
      type: NodeType.BreakStatement,
    };
  }

  // Continue Statement

  parseContinueStatement() {
    this._eat(TokenTypes.AGLI_CLASS);


    return {
      type: NodeType.ContinueStatement,
    };
  }

  //Empty Statement

  parseEmptyStatement() {
    this._eat(TokenTypes.SEMI_COLON_TYPE); // Consume the semicolon
    return {
        type: NodeType.EmptyStatement,
    };
}

  //If Statement

  parseIfStatement() {
    const HANDLED_LOOP_TOKEN_TYPES = [TokenTypes.PAKDE_GAYE, TokenTypes.NAHI_MILI_TOH];

    this._eat(TokenTypes.PROXY_MILI_TOH);
    this._eat(TokenTypes.OPEN_PARENTHESIS_TYPE);
    
    const check = this.parseBinaryRelationalExpression();
    this._eat(TokenTypes.CLOSED_PARENTHESIS_TYPE);
    
    if (this._lookahead == null) {
      throw new SyntaxError(`Unexpected end of PROXY_MILI_TOH statement`);
    }
    const consequent = this.parseBlockStatement();

    let alternate = []; // Initialize alternate as an empty array

    // Handle `ya toh` (else if) clauses
    while (this._lookahead?.type === TokenTypes.NAHI_MILI_TOH) {
      this._eat(TokenTypes.NAHI_MILI_TOH); // Consume `ya toh`
      this._eat(TokenTypes.OPEN_PARENTHESIS_TYPE); // Consume `(`
      
      const elseIfTest = this.parseBinaryRelationalExpression(); // Parse the condition
      this._eat(TokenTypes.CLOSED_PARENTHESIS_TYPE); // Consume `)`
      const elseIfConsequent = this.parseBlockStatement(); // Parse the block for the `else if` body

      // Nest the `ya toh` clause as an alternate
      alternate.push({
          type: NodeType.IfStatement,
          test: elseIfTest,
          consequent: elseIfConsequent,
      });
    }


    // Handle `PAKDE_GAYE` (else) clause
    if (this._lookahead?.type === TokenTypes.PAKDE_GAYE) {
      this._eat(TokenTypes.PAKDE_GAYE); // Consume `PAKDE_GAYE`
      const elseBlock = this.parseBlockStatement(); // Parse the block for the `else` body
      
      alternate.push({
          type: NodeType.BlockStatement,
          body: elseBlock.body,
      });
  }

    return {
      type: NodeType.IfStatement,
      test: check,
      consequent: consequent,
      alternates: alternate,
    }
    
  }

  //Expression Statement

  expressionStatement() {

    let init = this.parseAssignmentExpression();
    this._eat(TokenTypes.SEMI_COLON_TYPE); // Consume the semicolon
    return {
      type: NodeType.ExpressionStatement,
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
    return this.parseBinaryExpression();
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


  // Block Statement

  parseBlockStatement() {   
    this._eat(TokenTypes.OPEN_CURLY_BRACE_TYPE);
    const body = [];

    while (this._lookahead && this._lookahead.type !== TokenTypes.CLOSED_CURLY_BRACE_TYPE) {
      body.push(this.parseStatement());
    }

    this._eat(TokenTypes.CLOSED_CURLY_BRACE_TYPE);

    return {
      type: NodeType.BlockStatement,
      body,
    };
  }

  // Parse Binary Relational Expression

  parseBinaryRelationalExpression() {
    let left = this._parsePrimaryExpression();    
    while (this._isRelationalOperator(this._lookahead?.type)) {      
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

  parseAssignmentExpression() {
    let left = this._parsePrimaryExpression();
    while (this._isAssignmentOperator(this._lookahead?.type)) {
      const operator = this._eat(this._lookahead.type);
      const right = this.parseBinaryExpression();
  
      left = {
        type: NodeType.AssignmentExpression,
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

    if(token.type ===  TokenTypes.BOOLEAN_TYPE) {
      return this.parseBoolean();
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
      value: token.value.slice(1, -1), // remove surrounding quotes
    };
  }
  
  parseLiteral() {
    const token = this._eat(TokenTypes.NUMBER_TYPE);
    return {
      type: NodeType.NumericLiteral,
      value: Number(token.value),
    };
  }

  parseBoolean() {
    const token = this._eat(TokenTypes.BOOLEAN_TYPE);
    return {
      type: NodeType.BooleanLiteral,
      value: token.value,
    }
  }
  
  _isBinaryOperator(type) {
    return [TokenTypes.ADDITIVE_OPERATOR_TYPE,TokenTypes.MULTIPLICATIVE_OPERATOR_TYPE].includes(type);
  }

  _isRelationalOperator(type) {
    return [TokenTypes.RELATIONAL_OPERATOR,TokenTypes.EQUALITY_OPERATOR].includes(type);
  }
  _isAssignmentOperator(type) {
    return [TokenTypes.SIMPLE_ASSIGN_TYPE,TokenTypes.COMPLEX_ASSIGN_TYPE].includes(type);
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
