import React, { useState } from 'react'
import CodeEditor from './CodeEditor'
import ConsoleOutput from './ConsoleOutput'
import { executeCode } from '../utils/codeRunner'

const defaultCode = `// Write your code here
class chalu
 bol "Hello World";
 
  note kar a = 3;
  note kar b = 0;

  jab tak (b < 5) {
    bol b;

    proxy mili toh (b == a) {
      bol "b is equal to a";
    } nahi mili toh (b == 0) {
      bol "b is equal to zero";
    }

    b += 1;
  }
class khatam

`

const Playground = () => {
  const [code, setCode] = useState(defaultCode)
  const [output, setOutput] = useState([])

  const handleRunCode = () => {
    try {
      setOutput([])
      executeCode(code, setOutput)
    } catch (error) {
      setOutput(prev => [...prev, `Error: ${error.message}`])
    }
  }

  const handleClearCode = () => {
    setCode('')
    setOutput([])
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-[#2936482e] rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-secondary-800">
          <span className="text-rangoli-pink">Code</span> 
          <span className="text-rangoli-green">Playground</span>
        </h2>
        <p className="mb-4 text-secondary-600">
          Write your code below and click &quot;Run&quot; to see the output!
        </p>
        
        <CodeEditor code={code} setCode={setCode} />
        
        <div className="flex mt-4 space-x-4">
          <button 
            className="btn btn-primary flex-1"
            onClick={handleRunCode}
          >
            ▶️ Run
          </button>
          <button 
            className="btn btn-accent flex-1"
            onClick={handleClearCode}
          >
            🧹 Clear
          </button>
        </div>
        
        <ConsoleOutput output={output} />
      </div>
    </div>
  )
}

export default Playground