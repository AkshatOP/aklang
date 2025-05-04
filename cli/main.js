#! /usr/bin/env node
import { Interpreter } from "../interpreter/interpreter.js"; // your interpreter
import { Tokenizer } from "../Parser/tokenizer/tokenizer.js"; // your tokenizer
import { Parser } from "../Parser/parser/parser.js"; // your parser;
import { SPEC } from "../constants/specs.js"; // your spec file
import chalk from "chalk";
import fs from "fs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";








console.info(
  chalk.hex("#83aaff")(`
░█████╗░██╗░░██╗██╗░░░░░░█████╗░███╗░░██╗░██████╗░
██╔══██╗██║░██╔╝██║░░░░░██╔══██╗████╗░██║██╔════╝░
███████║█████═╝░██║░░░░░███████║██╔██╗██║██║░░██╗░
██╔══██║██╔═██╗░██║░░░░░██╔══██║██║╚████║██║░░╚██╗
██║░░██║██║░╚██╗███████╗██║░░██║██║░╚███║╚██████╔╝
╚═╝░░╚═╝╚═╝░░╚═╝╚══════╝╚═╝░░╚═╝╚═╝░░╚══╝░╚═════╝░


https://github.com/AkshatOP/aklang
`)
);

const cl = console.log;

console.log = function (...args) {
  const newArgs = args.map((arg) => {
    return `${chalk.hex("#83aaff")("")}${chalk.greenBright(arg)}`;
  });
  cl.apply(console, newArgs);
};

const filePath = yargs(hideBin(process.argv))
  .command(
    "<filepath>",
    "Interpret the contents of the specified file and print it to stdout",
    () => {},
    (argv) => {
      console.info(argv);
    }
  )
  .demandCommand(1).argv._[0];

fs.readFile(filePath, "utf8", (err, sourceCode) => {
  if (err) {
    console.error(err);
    return;
  }
  try {
    // Init tokenizer
    const tokenizer = new Tokenizer(SPEC);
    tokenizer.initTokenizer(sourceCode);

    const parser = new Parser(tokenizer);
    parser.init();  

    const ast = parser.parseProgram();
    // console.dir(ast, { depth: null });

    const interpreter = new Interpreter(ast);
    interpreter.interpret(ast);
  } catch (ex) {
    if (ex instanceof Error) {
      console.error("\n", chalk.redBright(ex.stack));
    }
  }
});
