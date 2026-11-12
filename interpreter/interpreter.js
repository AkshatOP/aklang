import Scope from "./scope.js";
import { NodeType } from "../constants/NodeTypes.js";
import  InvalidStateException  from "./exceptions/invalidStateException.js";
import RuntimeException from "./exceptions/runtimeException.js";
import NullPointerException from "./exceptions/nullPointerException.js";

// Safety cap so an infinite loop can't freeze the CLI or the browser playground.
const MAX_LOOP_ITERATIONS = 5000;


export class Interpreter {
    constructor(ast) {
        this.ast = ast;
        // Text printed by `bol abhi` that is still waiting for the end of its line.
        // Everything goes out through console.log, so the CLI and the browser
        // playground capture output the same way.
        this._pendingOutput = "";
        Interpreter.setCurrentScope(new Scope(null)); // Fresh global scope for every run
    }

    interpret() {
        try{
            this.visit(this.ast); // Start interpreting the AST
        } finally {
            this._flushOutput();
            Interpreter.setCurrentScope(new Scope(null)); // Reset the scope after interpretation
        }
    }

    visit(node) {

        switch(node.type) {
            case NodeType.Program:
                return this.visitProgram(node);

            case NodeType.PrintStatement:
                return this.visitPrintStatement(node);

            case NodeType.SameLinePrintStatement:
                return this.visitSameLinePrintStatement(node);

            case NodeType.NumericLiteral:
                return this.visitNumericLiteral(node);

            case NodeType.BooleanLiteral:
                return this.visitBooleanLiteral(node);

            case NodeType.StringLiteral:
                return this.visitStringLiteral(node);

            case NodeType.NullLiteral:
                return this.visitNullLiteral(node);

            case NodeType.EmptyStatement:
                return this.visitEmptyLiteral(node);

            case NodeType.ExpressionStatement:
                return this.visitExpressionStatement(node);

            case NodeType.IdentifierExpression:
                return this.visitIdentifierExpression(node);

            case NodeType.AssignmentExpression:
                return this.visitAssignmentExpression(node);

            case NodeType.BinaryExpression:
                return this.visitBinaryExpression(node);

            case NodeType.LogicalExpression:
                return this.visitLogicalExpression(node);

            case NodeType.UnaryExpression:
                return this.visitUnaryExpression(node);

            case NodeType.BlockStatement:
                return this.visitBlockStatement(node);

            case NodeType.IfStatement:
                return this.visitIfStatement(node);

            case NodeType.WhileStatement:
                return this.visitWhileStatement(node);

            case NodeType.VariableStatement:
                return this.visitVariableStatement(node);

            case NodeType.VariableDeclaration:
                return this.visitVariableDeclaration(node);

            case NodeType.BreakStatement:
                return this.visitBreakStatement(node);

            case NodeType.ContinueStatement:
                return this.visitContinueStatement(node);

            default:
                throw new Error(`No visit method defined by AK for node type: ${node.type}`);


        }

    }


    visitProgram(node) {
        for (const statement of node.body) {
            this.visit(statement); // Visit each statement in the program
        }
    }

    // ---------- Output ----------

    // Booleans are stored as real JS true/false and only shown as pass/fail here.
    _formatValue(value) {
        if (value === true) return "pass";
        if (value === false) return "fail";
        return String(value);
    }

    _evaluateToText(expressions) {
        return expressions
            .map(expression => this._formatValue(this.visit(expression)))
            .join(" ");
    }

    _flushOutput() {
        if (this._pendingOutput !== "") {
            console.log(this._pendingOutput);
            this._pendingOutput = "";
        }
    }

    visitPrintStatement(node) {
        if (!node.expressions)
            throw new InvalidStateException(
              `print karne kuch de toh: ${node.expressions}`
        );
        const text = this._evaluateToText(node.expressions);
        console.log(this._pendingOutput + text); // Finish any `bol abhi` line, then end it
        this._pendingOutput = "";
    }

    visitSameLinePrintStatement(node) {
        if(!node.expressions) {
            throw new InvalidStateException(
                `print karne kuch de toh: ${node.expressions}`
            );
        }
        this._pendingOutput += this._evaluateToText(node.expressions); // No newline yet
    }

    // ---------- Variables ----------

    visitVariableStatement(node) {
        if (!node.declarations)
            throw new InvalidStateException(
              `variable declarations in variable statement is not present: ${node.declarations}`
        );

        for (const declaration of node.declarations) {
            this.visit(declaration); // Visit each variable declaration
        }

    }

    visitVariableDeclaration(node) {
        if(!node.id || !node.init) {
            throw new InvalidStateException(
                `galat variable declaration: ${node.id} = ${node.init}`
            );
        }

        const value = this.visit(node.init); // NullLiteral evaluates to null
        Interpreter.getCurrentScope().declare(node.id.name, value);
    }


    visitExpressionStatement(node) {
        if(node.expression){
            this.visit(node.expression);
        }
    }


    visitIdentifierExpression(node) {
        if(!node.name) {
            throw new InvalidStateException(
                `galat identifier expression: ${node.name}`
            );
        }

        return Interpreter.getCurrentScope().get(node.name); // Walks up parent scopes
    }

    visitAssignmentExpression(node) {
        if(!node.left || !node.left.name) {
            throw new InvalidStateException(
                `left node not present: ${node.type}`
            );
        }

        const identifier = node.left.name;
        const operator = node.operator;
        const right = this.visit(node.right);
        const currentScope = Interpreter.getCurrentScope();

        if (operator === "=") {
            currentScope.assign(identifier, right);
            return right;
        }

        // Compound assignment (+=, -=, ...) applies the operator to the current value
        const left = currentScope.get(identifier);
        this._checkOperands(left, right, operator);

        const newValue = this.getOperatorFunction({left, right} , operator);
        currentScope.assign(identifier , newValue);
        return newValue;
    }

    // ---------- Expressions ----------

    visitBinaryExpression(node) {
        if(!node.left || !node.right || !node.operator) {
            throw new InvalidStateException(
                `Invalid binary expression: ${node.left} ${node.operator} ${node.right}`
            );
        }

        const left = this.visit(node.left);
        const right = this.visit(node.right);

        // == and != may compare anything (including null and booleans)
        if(node.operator !== "==" && node.operator !== "!=") {
            this._checkOperands(left, right, node.operator);
        }

        return this.getOperatorFunction({left , right} , node.operator);
    }

    // && and || short-circuit: the right side is only evaluated if it can change the result.
    visitLogicalExpression(node) {
        const left = this.visit(node.left);
        this._checkLogicalOperand(left, node.operator);

        if (node.operator === "&&" && left === false) return false;
        if (node.operator === "||" && left === true) return true;

        const right = this.visit(node.right);
        this._checkLogicalOperand(right, node.operator);
        return right;
    }

    visitUnaryExpression(node) {
        const value = this.visit(node.argument);

        if (typeof value !== "number") {
            throw new RuntimeException(
                `"${node.operator}" sirf number ke sath chalta hai, "${this._formatValue(value)}" ke sath nahi`
            );
        }

        return node.operator === "-" ? -value : value;
    }

    _checkOperands(left, right, operator) {
        if (left === null || right === null) {
            throw new NullPointerException(
                `Null operand ni chalta "${operator}" ke sath`
            );
        }

        if (typeof left === "boolean" || typeof right === "boolean") {
            throw new RuntimeException(
                `Boolean operand ni chalta "${operator}" ke sath`
            );
        }
    }

    _checkLogicalOperand(value, operator) {
        if (typeof value !== "boolean") {
            throw new RuntimeException(
                `"${operator}" ke sath sirf pass/fail chalta hai, "${this._formatValue(value)}" nahi`
            );
        }
    }

    // ---------- Blocks and control flow ----------
    //
    // break / continue are flags on the scope. A statement sets the flag, every
    // block stops running its remaining statements once a flag is set and copies
    // the flag up to its parent scope, and the loop reads and clears it.

    visitBlockStatement(node) {
        const parentScope = Interpreter.getCurrentScope();
        const blockScope = new Scope(parentScope); // New scope per block run, so `note kar` in a loop body works every pass
        blockScope.setLoop(parentScope.isLoop()); // break/continue are legal if any enclosing scope is a loop

        Interpreter.setCurrentScope(blockScope);

        try {
            for (const statement of node.body) {
                this.visit(statement);

                if (blockScope.isBreakStatement() || blockScope.isContinueStatement()) {
                    break; // Skip the rest of this block
                }
            }
        } finally {
            Interpreter.setCurrentScope(parentScope);
        }

        // Hand the flags to the enclosing scope so the loop can see them
        parentScope.setBreakStatement(blockScope.isBreakStatement());
        parentScope.setContinueStatement(blockScope.isContinueStatement());
    }

    _isTrue(value) {
        return value === true;
    }

    visitIfStatement(node) {
        if (this._isTrue(this.visit(node.test))) {
            this.visit(node.consequent);
            return;
        }

        for (const alternate of node.alternates ?? []) {
            if (!alternate.test) {
                // `pakde gaye` (else) has no test, and is always last
                this.visit(alternate);
                return;
            }

            // `nahi mili toh` (else if)
            if (this._isTrue(this.visit(alternate.test))) {
                this.visit(alternate.consequent);
                return;
            }
        }
    }

    visitWhileStatement(node) {
        const parentScope = Interpreter.getCurrentScope();
        const loopScope = new Scope(parentScope); // Holds this loop's break/continue flags
        loopScope.setLoop(true);

        Interpreter.setCurrentScope(loopScope);

        try {
            let executions = 0;

            while (this._isTrue(this.visit(node.test))) {
                executions++;
                if (executions > MAX_LOOP_ITERATIONS) {
                    throw new RuntimeException("Tham ja re , loop infinite ho gaya hai");
                }

                this.visit(node.body);

                if (loopScope.isBreakStatement()) {
                    break;
                }

                loopScope.setContinueStatement(false); // `agli class` only skips the rest of this pass
            }
        } finally {
            Interpreter.setCurrentScope(parentScope);
        }
    }


    visitBreakStatement(node) {
        if (Interpreter.getCurrentScope().isLoop()) {
            Interpreter.getCurrentScope().setBreakStatement(true);
        } else {
            throw new SyntaxError(`Loop kahan hai? "bunk maar" nahi chalega`);
        }
    }

    visitContinueStatement(node) {
        if (Interpreter.getCurrentScope().isLoop()) {
            Interpreter.getCurrentScope().setContinueStatement(true);
        } else {
            throw new SyntaxError(`Loop kahan hai? "agli class" nahi chalega`);
        }
    }

    // ---------- Operators ----------

    getOperatorFunction(operands , operator){

        const exception = new RuntimeException(
            `Kya krra: "${operator}" ke sath "${typeof operands.left}" aur "${typeof operands.right}" nahi chalte.`
        );

        switch(operator) {
            case "+=":
            case "+":
                if (this.checkNumberOperands(operands)) {
                    return operands.left + operands.right;
                }

                if (this.checkStringOperands(operands)) {
                    return operands.left + operands.right;
                }

                if (this.checkNumberAndStringOperands(operands)) {
                    return operands.left.toString() + operands.right.toString();
                }

                throw exception;

            case "-=":
            case "-":
                if (this.checkNumberOperands(operands)) {
                    return operands.left - operands.right;
                }

                throw exception;

            case "*=":
            case "*":
                if (this.checkNumberOperands(operands)) {
                return operands.left * operands.right;
                }

                throw exception;

            case "/=":
            case "/":
                if (operands.right === 0) {
                throw new RuntimeException(`zero se divide ni karte re`);
                }

                if (this.checkNumberOperands(operands)) {
                return operands.left / operands.right;
                }

                throw exception;

            case "%=":
            case "%":
                if (operands.right === 0) {
                throw new RuntimeException(`zero se modulo ni karte re`);
                }

                if (this.checkNumberOperands(operands)) {
                return operands.left % operands.right;
                }

                throw exception;

            case "**":
                if (this.checkNumberOperands(operands)) {
                return operands.left ** operands.right;
                }

                throw exception;

            case "==":

                return operands.left === operands.right;

            case "!=":

                return operands.left !== operands.right;

            case ">":
                if (this.checkNumberOperands(operands)) {
                return operands.left > operands.right;
                }

                throw exception;

            case "<":
                if (this.checkNumberOperands(operands)) {
                return operands.left < operands.right;
                }

                throw exception;

            case ">=":
                if (this.checkNumberOperands(operands)) {
                return operands.left >= operands.right;
                }

                throw exception;

            case "<=":
                if (this.checkNumberOperands(operands)) {
                return operands.left <= operands.right;
                }

                throw exception;

            default:
                throw new InvalidStateException(`Unsupported operator: ${operator}`);

        }


    }


    checkNumberOperands(operands) {
        return (
          typeof operands.left === "number" && typeof operands.right === "number"
        );
    }

    checkStringOperands(operands){

        return (
          typeof operands.left === "string" && typeof operands.right === "string"
        );
      }

    checkNumberAndStringOperands(operands){
        return (
          (typeof operands.left === "string" && typeof operands.right === "number") || (typeof operands.right === "string" && typeof operands.left === "number")
        );
      }

    // ---------- Literals ----------

    visitEmptyLiteral(node) {
        // Handle empty statement (no operation)
        return ; // Return empty statements
    }


    visitNumericLiteral(node) {
        return node.value; // Return the numeric value
    }

    visitNullLiteral(node) {
        return node.value; // Return null value
    }

    visitBooleanLiteral(node) {
        return node.value === "pass"; // Token text "pass"/"fail" -> real boolean
    }

    visitStringLiteral(node) {
        return node.value; // Return the string value
    }



    static getCurrentScope() {
        this._currentScope = this._currentScope ?? new Scope(null);
        return this._currentScope;
    }

    static setCurrentScope(scope) {
        this._currentScope = scope;
    }






}
