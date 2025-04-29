import { SPEC } from "../../constants/specs.js";

export class Tokenizer {
    constructor(){
        this._string = "";
        this._cursor = 0; //cursor from the start of the string
        this._line = 1; //line number
    }

    initTokenizer(code) {
        this._string = code;
        this._cursor = 0;
        this._line = 1; // Reset line number
    }

    isEOF() {
        return this._cursor >= this._string.length;
    }

    hasMoreTokens() {
        return this._cursor < this._string.length;
    }

    getNextToken() {
       
        if (this.isEOF()) return null;

        const str = this._string.slice(this._cursor);

        for( const { regex, tokenType } of SPEC ) {
            
            const matched = regex.exec(str);
            
            if(!matched) continue;

            const value = matched[0];
            this._cursor += value.length; // Moving the cursor forward by the length of the matched string

            // Count line breaks in the matched string
            const lineBreaks = value.match(/\n/g);
            if (lineBreaks) {
                this._line += lineBreaks.length;
            }

            //skip whitespaces and lines type null tokens
            if (tokenType === null) {
                // console.log("Skipping NULL_TYPE token:", tokenType, value, this._line);
                return this.getNextToken();
            }


            
            
            // console.log("Matched token:", this._string , tokenType, this._line);
            return {
                type: tokenType,
                value,
                line: this._line,
            };
        }

        throw new SyntaxError(`Unexpected token on line ${this._line}: "${str.slice(0, 10)}..." & ${this._string[this._cursor]}`);


    }


}