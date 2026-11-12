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

    const test = this.parseExpression();
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
    
    const check = this.parseExpression();
    this._eat(TokenTypes.CLOSED_PARENTHESIS_TYPE);
    
    if (this._lookahead == null) {
      throw new SyntaxError(`Unexpected end of PROXY_MILI_TOH statement`);
    }
    const consequent = this.parseBlockStatement();

    let alternate = []; // Initialize alternate as an empty array

    // Handle `nahi mili toh` (else if) clauses
    while (this._lookahead?.type === TokenTypes.NAHI_MILI_TOH) {
      this._eat(TokenTypes.NAHI_MILI_TOH); // Consume `nahi mili toh`
      this._eat(TokenTypes.OPEN_PARENTHESIS_TYPE); // Consume `(`
      
      const elseIfTest = this.parseExpression(); // Parse the condition
      this._eat(TokenTypes.CLOSED_PARENTHESIS_TYPE); // Consume `)`
      const elseIfConsequent = this.parseBlockStatement(); // Parse the block for the `else if` body

      // Store the `nahi mili toh` clause as an alternate
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

    let init = this.parseExpression();
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

  // Expressions, lowest precedence first. Each level calls the next one,
  // so operators lower in this list bind tighter:
  //   assignment  =  +=  -=  *=  /=  %=   (right-associative)
  //   logical or  ||
  //   logical and &&
  //   equality    ==  !=
  //   relational  <  >  <=  >=
  //   additive    +  -
  //   multiplicative  *  /  %
  //   unary       -x  +x
  //   power       **                    (right-associative)
  //   primary     literal, identifier, ( expression )

  parseExpression() {
    return this.parseAssignmentExpression();
  }

  parseAssignmentExpression() {
    const left = this.parseLogicalOrExpression();

    if (!this._isAssignmentOperator(this._lookahead?.type)) {
      return left;
    }

    const operator = this._eat(this._lookahead.type);

    if (left.type !== NodeType.IdentifierExpression) {
      throw new SyntaxError(
        `Line ${operator.line}: "${operator.value}" ke left mein variable chahiye`
      );
    }

    // Recursing (instead of looping) makes a = b = 5 group as a = (b = 5)
    const right = this.parseAssignmentExpression();

    return {
      type: NodeType.AssignmentExpression,
      operator: operator.value,
      left,
      right,
    };
  }

  parseLogicalOrExpression() {
    return this._parseLeftAssociative(
      [TokenTypes.LOGICAL_OR],
      () => this.parseLogicalAndExpression(),
      NodeType.LogicalExpression
    );
  }

  parseLogicalAndExpression() {
    return this._parseLeftAssociative(
      [TokenTypes.LOGICAL_AND],
      () => this.parseEqualityExpression(),
      NodeType.LogicalExpression
    );
  }

  parseEqualityExpression() {
    return this._parseLeftAssociative(
      [TokenTypes.EQUALITY_OPERATOR],
      () => this.parseRelationalExpression()
    );
  }

  parseRelationalExpression() {
    return this._parseLeftAssociative(
      [TokenTypes.RELATIONAL_OPERATOR],
      () => this.parseAdditiveExpression()
    );
  }

  parseAdditiveExpression() {
    return this._parseLeftAssociative(
      [TokenTypes.ADDITIVE_OPERATOR_TYPE],
      () => this.parseMultiplicativeExpression()
    );
  }

  parseMultiplicativeExpression() {
    // ** shares the MULTIPLICATIVE token type but lives on its own level (parsePowerExpression)
    return this._parseLeftAssociative(
      [TokenTypes.MULTIPLICATIVE_OPERATOR_TYPE],
      () => this.parseUnaryExpression(),
      NodeType.BinaryExpression,
      (token) => token.value !== "**"
    );
  }

  parseUnaryExpression() {
    if (this._lookahead?.type === TokenTypes.ADDITIVE_OPERATOR_TYPE) {
      const operator = this._eat(TokenTypes.ADDITIVE_OPERATOR_TYPE);
      return {
        type: NodeType.UnaryExpression,
        operator: operator.value,
        argument: this.parseUnaryExpression(),
      };
    }

    return this.parsePowerExpression();
  }

  parsePowerExpression() {
    const base = this._parsePrimaryExpression();

    if (
      this._lookahead?.type === TokenTypes.MULTIPLICATIVE_OPERATOR_TYPE &&
      this._lookahead.value === "**"
    ) {
      const operator = this._eat(TokenTypes.MULTIPLICATIVE_OPERATOR_TYPE);
      // Right side goes back through unary, so 2 ** 3 ** 2 = 2 ** 9 and 2 ** -1 both work
      const exponent = this.parseUnaryExpression();

      return {
        type: NodeType.BinaryExpression,
        operator: operator.value,
        left: base,
        right: exponent,
      };
    }

    return base;
  }

  // One loop shared by every left-associative level: a - b - c => (a - b) - c
  _parseLeftAssociative(tokenTypes, parseOperand, nodeType = NodeType.BinaryExpression, accept = () => true) {
    let left = parseOperand();

    while (
      this._lookahead &&
      tokenTypes.includes(this._lookahead.type) &&
      accept(this._lookahead)
    ) {
      const operator = this._eat(this._lookahead.type);
      const right = parseOperand();

      left = {
        type: nodeType,
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

  _parsePrimaryExpression() {
    const token = this._lookahead;

    if (token === null) {
      throw new SyntaxError(`Expression adhoora hai: file khatam ho gayi`);
    }

    if(token.type === TokenTypes.OPEN_PARENTHESIS_TYPE) {
      this._eat(TokenTypes.OPEN_PARENTHESIS_TYPE);
      const expression = this.parseExpression();
      this._eat(TokenTypes.CLOSED_PARENTHESIS_TYPE);
      return expression;
    }

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

    throw new SyntaxError(`Line ${token.line}: Unexpected token "${token.value}"`)

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
  
  _isAssignmentOperator(type) {
    return [TokenTypes.SIMPLE_ASSIGN_TYPE,TokenTypes.COMPLEX_ASSIGN_TYPE].includes(type);
  }








  _eat(tokenType) {
    const token = this._lookahead;

    if (token === null) {
      throw new SyntaxError(`Expected "${tokenType}", but file khatam ho gayi`);
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(
        `Line ${token.line}: Expected "${tokenType}", got "${token.value}"`
      );
    }

    this._lookahead = this._tokenizer.getNextToken();
    return token;
  }
}
