import { Tokenizer } from '../../../Parser/tokenizer/tokenizer.js'   // adjust if needed
import { Parser } from '../../../Parser/parser/parser.js'         // adjust if needed
import { Interpreter } from '../../../interpreter/interpreter.js'
import { SPEC } from '../../../constants/specs.js'             // assuming SPEC is defined somewhere
// import { Tokenizer } from '../aklang/interpreter/Tokenizer'
// import { Parser } from '../aklang/interpreter/Parser'
// import { Interpreter } from '../aklang/interpreter/Interpreter'
// import { SPEC } from '../aklang/interpreter/spec' // or wherever your SPEC is

export const executeCode = (code, setOutput) => {
  // Save original console methods
  const originalLog = console.log
  const originalError = console.error
  const originalWarn = console.warn
  const originalInfo = console.info

  try {
    // Override console methods to capture output into UI
    console.log = (...args) => {
      setOutput(prev => [...prev, args.join(' ')])
      originalLog(...args)
    }

    console.error = (...args) => {
      setOutput(prev => [...prev, `Error: ${args.join(' ')}`])
      originalError(...args)
    }

    console.warn = (...args) => {
      setOutput(prev => [...prev, `Warning: ${args.join(' ')}`])
      originalWarn(...args)
    }

    console.info = (...args) => {
      setOutput(prev => [...prev, `Info: ${args.join(' ')}`])
      originalInfo(...args)
    }

    // ✅ Run your Aklang pipeline (no need to change your Interpreter)
    const tokenizer = new Tokenizer(SPEC)
    tokenizer.initTokenizer(code)

    const parser = new Parser(tokenizer)
    parser.init()
    const ast = parser.parseProgram()

    const interpreter = new Interpreter(ast)
    interpreter.interpret(ast)
    
  } catch (error) {
    if(error.message === "process is not defined") return;
    setOutput(prev => [...prev, `AKLang Error: ${error.message}`])
  } finally {
    // Restore original console methods
    console.log = originalLog
    console.error = originalError
    console.warn = originalWarn
    console.info = originalInfo
  }
}
