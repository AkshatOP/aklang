import Scope from "./scope.js";
import { NodeType } from "../constants/NodeTypes.js";
import  InvalidStateException  from "./exceptions/invalidStateException.js";
import RuntimeException from "./exceptions/runtimeException.js";
import NullPointerException from "./exceptions/nullPointerException.js";


export class Interpreter {
    constructor(ast) {
        this.ast = ast;
        this._currentScope = new Scope(null); // Initialize the global scope
    }

    interpret() {
        try{
        this.visit(this.ast); // Start interpreting the AST
        } finally {
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
        process.stdout.write('\n'); // Flush remaining buffered output
    }

    visitPrintStatement(node) {
        if (!node.expressions)
            throw new InvalidStateException(
              `print karne kuch de toh: ${node.expressions}`
        );
        let values = node.expressions.map(expression => this.visit(expression));
        console.log(...values); // Print the evaluated expressions
    }

    visitSameLinePrintStatement(node) {
        if(!node.expressions) {
            throw new InvalidStateException(
                `print karne kuch de toh: ${node.expressions}`
            );
        }
        // console.log(node.expressions)
        let values = node.expressions.map(expression => {
            const result = this.visit(expression);
            return result // Convert the result to a string
        });
        
    }

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

        const identifier = node.id.name; // Get the variable name
        let value;

        if(node.init.type === NodeType.BooleanLiteral) {
            value = node.init.value == "pass" ? true : false; // Evaluate the initializer
        } else if (node.init.type === NodeType.NullLiteral) {
            value = null; // Handle null literal
        } else {
            value = this.visit(node.init); // Visit the initializer
        }

        const currentScope = Interpreter.getCurrentScope(); // Get the current scope

        if (identifier) {
            currentScope.declare(identifier, value);
        }
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

        let value = Interpreter.getCurrentScope().get(node.name); // Get the variable value from the current scope
        
        if(value === null) value = null; // Handle null value
        else if(value === true) value = "pass"; // Convert boolean to string
        else if(value === false) value = "fail"; // Convert boolean to string

        return value; // Return the variable value
       
    }

    visitAssignmentExpression(node) {
        if(!node.left) {
            throw new InvalidStateException(
                `left node not present: ${node.type}`
            );
        }

        let identifier = node.left.name; // Get the variable name
        let operator = node.operator; // Get the assignment operator
        let right;
        const currentScope = Interpreter.getCurrentScope(); // Get the current scope

        if(node.right){
            right = this.visit(node.right); // Visit the right side of the assignment
        }

        if (identifier && operator) {

            const left = currentScope.get(identifier);


            if( left === null && operator !== "=") {
                throw new NullPointerException(
                    `Null ese kaam nahi karta: ${node.left} ${node.operator} ${node.right}`
                );
            }

            if(left == true && right == false && operator !== "=") {
                throw new RuntimeException( 
                    `pass aur fail ese kaam nahi karta: ${node.left} ${node.operator} ${node.right}`
                );
            }

            const newValue = this.getOperatorFunction({left, right} , operator);
            currentScope.assign(identifier , newValue);

            return currentScope.get(identifier);
        }




    }





    visitBinaryExpression(node) {
        if(!node.left || !node.right || !node.operator) {
            throw new InvalidStateException(
                `Invalid binary expression: ${node.left} ${node.operator} ${node.right}`
            );
        }

        let left;
        let right;

        // handling logical & binary both at the same place as both operate on two operands
        if(node.type == NodeType.BinaryExpression){
            if(node.operator !== "==" && node.operator !== "!=") {
                this._checkNull(node);
                this._checkBoolean(node);
            }

            left = this._getNodeValue(node.left); // Visit the left operand
            right = this._getNodeValue(node.right); // Visit the right operand

        } else if(node.type == NodeType.LogicalExpression) {
            this._checkNull(node);

            left = node.left.type == NodeType.BooleanLiteral ? (node.left.value == "pass" ? true : false) : this.visit(node.left);

            right = node.right.type == NodeType.BooleanLiteral ? (node.right.value == "pass" ? true : false) : this.visit(node.right);

        }

        return this.getOperatorFunction({left , right} , node.operator); // Return the result of the binary operation
    }


    _checkNull(node) {
        if (!node.left || !node.right || !node.operator) {
            throw new InvalidStateException(
            `Left , right or operator not found for: ${node.type}` 
            );// Check if left, right, or operator is not found
        }

        const nullException = new NullPointerException(
            `Null operand ni chalta "${node.operator}" ke sath`
        ); // Create a new NallaPointerException

        if (
            node.left.type === NodeType.NullLiteral ||
            node.right.type === NodeType.NullLiteral
        )
            throw nullException; // Check if left or right operand is null

        if (node.left.type === NodeType.IdentifierExpression && node.left.name) {
            const value = Interpreter.getCurrentScope().get(node.left.name);
            if (value === null) throw nullException;
        }

        if (node.right.type === NodeType.IdentifierExpression && node.right.name) {
            const value = Interpreter.getCurrentScope().get(node.right.name);
            if (value === null) throw nullException;
        }
    }
    
    _checkBoolean(node) {
    
        if (!node.left || !node.right || !node.operator) {
          throw new InvalidStateException(
            `Left , right or operator not found for: ${node.type}`
          );
        }
    
        const runtimeException = new RuntimeException(
          `Boolean operand ni chalta "${node.operator}" ke sath`
        );
    
        if (
          node.left.type === NodeType.BooleanLiteral ||
          node.right.type === NodeType.BooleanLiteral
        )
          throw runtimeException;
    
        if (node.left.type === NodeType.IdentifierExpression && node.left.name) {
          const value = Interpreter.getCurrentScope().get(node.left.name);
          if (value === true || value === false) throw runtimeException;
        }
    
        if (node.right.type === NodeType.IdentifierExpression && node.right.name) {
          const value = Interpreter.getCurrentScope().get(node.right.name);
          if (value === true || value === false) throw runtimeException;
        }
    }
    
    _getNodeValue(node) {
    
        if (node.type === NodeType.NullLiteral)
          return null;
    
        if (node.type === NodeType.BooleanLiteral) {
          return node.value === "sahi" ? true : false;
        }
    
        if (node.type === NodeType.IdentifierExpression && node.name)
          return Interpreter.getCurrentScope().get(node.name);
    
        return this.visit(node); // Visit the node to get its value
    }

    visitBlockStatement(node) {
        const parentScope = Interpreter.getCurrentScope(); // Get the parent scope
        Interpreter.setCurrentScope(parentScope); // Set the new scope as the current scope

        Interpreter.getCurrentScope().setLoop(parentScope.isLoop()); // Set the loop status in the new scope

        if(Array.isArray(node.body) ) {
            node.body.every(line => {
                if(Interpreter.getCurrentScope().isBreakStatement()) {
                    return false; // Break statement encountered, exit the loop
                }

                if(Interpreter.getCurrentScope().isContinueStatement()) {
                    Interpreter.getCurrentScope().setContinueStatement(true); // Reset continue statement
                    return false; // Continue to the next iteration
                }

                this.visit(line); // Visit each line in the block
                return true; // Continue to the next line
            });
        }

        parentScope.setBreakStatement(Interpreter.getCurrentScope().isBreakStatement()); // Set the break statement status in the parent scope
        Interpreter.setCurrentScope(parentScope); // Reset the current scope to the parent scope

    }

    visitIfStatement(node) {
        const test = node.test; // Evaluate the test condition
        const parentScope = Interpreter.getCurrentScope(); // Get the parent scope
        
        

        if(test) {
            const testResult = this.visit(test);
            if(testResult === true || testResult === "pass" ) {
                
            this.evaluateNode(node.consequent , parentScope);
            
        } else {
            const alternates = node.alternates;
            if( alternates && alternates.length > 0){
                for( var alternate of alternates) {
                    const alternateTest = alternate.test;
                    if(!alternateTest){
                        //we got to warna condition so we terminate
                        this.evaluateNode(alternate, parentScope);
                        break;
                    } else {
                        // Evaluate the "test" condition of the "ya toh" node
                        // If the condition is true, evaluate the node and break
                        const testResult = this.visit(alternateTest);
                        if (testResult === true || testResult === "pass" ) {
                            this.evaluateNode(alternate.consequent , parentScope);
                            break;
                        }
                    }
                }
            }
            
        }
    }
        parentScope.setBreakStatement(Interpreter.getCurrentScope().isBreakStatement());
        parentScope.setContinueStatement(Interpreter.getCurrentScope().isContinueStatement());
    
        Interpreter.setCurrentScope(parentScope);
    }

    evaluateNode(node, parentScope) {
        if (node) {
          Interpreter.setCurrentScope(new Scope(parentScope));
          Interpreter.getCurrentScope().setLoop(parentScope.isLoop());
          this.visit(node);
        }
      }

    






    visitWhileStatement(node) {
        const test = node.test;
    if (test) {
      const getConditionValue = ()=> this.visit(test);

      const parentScope = Interpreter.getCurrentScope();

      Interpreter.setCurrentScope(new Scope(parentScope));
      
      Interpreter.getCurrentScope().setLoop(true);


      for (let testResult = getConditionValue(), executions = 0; testResult === true || testResult === "pass"; testResult = getConditionValue(), executions++) {

        if (Interpreter.getCurrentScope().isBreakStatement()) {
          break;
        }

        if (executions > 5000) {
          throw new RuntimeException("Tham ja re , loop infinite ho gaya hai");
        }


        if(Interpreter.getCurrentScope().isContinueStatement()){
          Interpreter.getCurrentScope().setContinueStatement(false);
          continue;
        }

        const body = node.body;
        if (body && !Array.isArray(body)) {
          this.visit(body);
        }
      }

      Interpreter.setCurrentScope(parentScope);
    }

    }

    


    visitBreakStatement(node) {
        if (Interpreter.getCurrentScope().isLoop()) {
            Interpreter.getCurrentScope().setBreakStatement(true);
        } else {
            throw new SyntaxError(`Loop kahan hai? "ab bas" nahi chalega`);
        }
    }

    visitContinueStatement(node) {
        if (Interpreter.getCurrentScope().isLoop()) {
            Interpreter.getCurrentScope().setContinueStatement(true);
        } else {
            throw new SyntaxError(`Loop kahan hai? "agla dekh" nahi chalega`);
        }
    }

    getOperatorFunction(operands , operator){

        const exception = new SyntaxError(
            `Kya krra: "${operator}" ke sath "${typeof operands.left}" aur "${typeof operands.right}" nahi chalte.`
        );

        switch(operator) {
            case "=":
                return operands.right;

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
        
            case "&&":
                return operands.left && operands.right;
        
            case "||":
                return operands.left || operands.right;
        
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
        return node.value; // Return the numeric value
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
