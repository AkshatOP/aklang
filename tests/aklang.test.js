import { test } from "node:test";
import assert from "node:assert/strict";
import { Tokenizer } from "../Parser/tokenizer/tokenizer.js";
import { Parser } from "../Parser/parser/parser.js";
import { Interpreter } from "../interpreter/interpreter.js";
import { SPEC } from "../constants/specs.js";

// Runs an aklang program body and returns the printed lines.
function run(body) {
  const lines = [];
  const originalLog = console.log;
  console.log = (...args) => lines.push(args.join(" "));
  try {
    const tokenizer = new Tokenizer(SPEC);
    tokenizer.initTokenizer(`class chalu\n${body}\nclass khatam`);
    const parser = new Parser(tokenizer);
    parser.init();
    new Interpreter(parser.parseProgram()).interpret();
  } finally {
    console.log = originalLog;
  }
  return lines;
}

test("hello world", () => {
  assert.deepEqual(run(`bol "All iz Well";`), ["All iz Well"]);
});

test("operator precedence: * before +, parentheses override", () => {
  assert.deepEqual(run(`bol 1 + 2 * 3; bol (1 + 2) * 3; bol 10 - 4 - 3;`), ["7", "9", "3"]);
});

test("** binds tighter than unary minus and is right-associative", () => {
  assert.deepEqual(run(`bol 2 ** 3 ** 2; bol -2 ** 2; bol 2 ** -1;`), ["512", "-4", "0.5"]);
});

test("a-1 without spaces is subtraction, and unary minus works", () => {
  assert.deepEqual(run(`note kar a = 5; bol a-1; bol -a; bol 3 - -2;`), ["4", "-5", "5"]);
});

test("arithmetic inside conditions", () => {
  assert.deepEqual(run(`note kar i = 1; proxy mili toh (i + 1 == 2) { bol "yes"; }`), ["yes"]);
});

test("pass/fail are real booleans and print as pass/fail", () => {
  assert.deepEqual(
    run(`note kar a = pass; bol a; bol 1 < 2; proxy mili toh (a == pass) { bol "yes"; } pakde gaye { bol "no"; }`),
    ["pass", "pass", "yes"]
  );
});

test("&& and || short-circuit", () => {
  // `x` is never declared; short-circuit means it is never looked up
  assert.deepEqual(
    run(`bol fail && x; bol pass || x; bol 1 < 2 && 2 < 3; bol pass && fail;`),
    ["fail", "pass", "pass", "fail"]
  );
});

test("else-if chain picks the first true branch", () => {
  assert.deepEqual(
    run(`note kar b = 0;
      proxy mili toh (b == 1) { bol "one"; }
      nahi mili toh (b == 0) { bol "zero"; }
      pakde gaye { bol "other"; }`),
    ["zero"]
  );
});

test("note kar inside a loop body works on every iteration", () => {
  assert.deepEqual(
    run(`note kar i = 0; jab tak (i < 3) { note kar y = i * 10; bol y; i += 1; }`),
    ["0", "10", "20"]
  );
});

test("block variables shadow and disappear after the block", () => {
  assert.deepEqual(
    run(`note kar a = 1; proxy mili toh (pass) { note kar a = 2; bol a; } bol a;`),
    ["2", "1"]
  );
  assert.throws(() => run(`proxy mili toh (pass) { note kar t = 1; } bol t;`), /bana to le pehle/);
});

test("bunk maar breaks only the innermost loop", () => {
  assert.deepEqual(
    run(`note kar i = 0;
      jab tak (i < 2) {
        note kar j = 0;
        jab tak (pass) { proxy mili toh (j == 2) { bunk maar; } j += 1; }
        bol i, j;
        i += 1;
      }`),
    ["0 2", "1 2"]
  );
});

test("agli class skips the rest of one pass only", () => {
  assert.deepEqual(
    run(`note kar i = 0; jab tak (i < 5) { i += 1; proxy mili toh (i == 3) { agli class; } bol i; }`),
    ["1", "2", "4", "5"]
  );
});

test("bol abhi prints without a newline", () => {
  assert.deepEqual(run(`bol abhi "a"; bol abhi "b"; bol "c"; bol abhi "d";`), ["abc", "d"]);
});

test("compound assignment", () => {
  assert.deepEqual(run(`note kar x = 1; x += 0; x *= 6; x -= 1; x /= 5; x %= 2; bol x;`), ["1"]);
});

test("friendly runtime errors", () => {
  assert.throws(() => run(`bol x;`), /bana to le pehle/);
  assert.throws(() => run(`note kar a = 1; note kar a = 2;`), /pehle se exist/);
  assert.throws(() => run(`bol 1 / 0;`), /zero se divide/);
  assert.throws(() => run(`note kar n; bol n + 1;`), /Null operand/);
  assert.throws(() => run(`bol pass + 1;`), /Boolean operand/);
  assert.throws(() => run(`bunk maar;`), /Loop kahan hai\? "bunk maar"/);
  assert.throws(() => run(`note kar i = 0; jab tak (pass) { i += 1; }`), /loop infinite/);
});

test("syntax errors include the line number", () => {
  assert.throws(() => run(`note kar a = 1\nbol a;`), /Line 3: Expected ";", got "bol"/);
  assert.throws(() => run(`5 = 3;`), /variable chahiye/);
});
