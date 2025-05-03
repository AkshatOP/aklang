import fs from "fs";
import path from "path";
import { Tokenizer } from "./Parser/tokenizer/tokenizer.js";     // your tokenizer
import { SPEC } from "./constants/specs.js";          // your spec file
import { Parser } from "./Parser/parser/parser.js";     // your parser
import { Interpreter } from "./interpreter/interpreter.js"; // your interpreter

// Get file from CLI args
const filePath = process.argv[2];

// Check if it ends with `.ak`
if (!filePath || path.extname(filePath) !== ".ak") {
  console.error("❌ Please provide a valid .ak file.");
  process.exit(1);
}

// Read file content
const sourceCode = fs.readFileSync(filePath, "utf-8");

// Init tokenizer
const tokenizer = new Tokenizer(SPEC);
tokenizer.initTokenizer(sourceCode);


const parser = new Parser(tokenizer);
parser.init();

const ast = parser.parseProgram();
// console.dir(ast, { depth: null });

const interpreter = new Interpreter(ast);
interpreter.interpret();

