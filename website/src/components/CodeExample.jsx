import React, { useState } from 'react'
import ConsoleOutput from './ConsoleOutput'
import { executeCode } from '../utils/codeRunner'
import { highlight, languages } from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism-tomorrow.css'

const CodeExample = ({ title, code, description }) => {
  const [output, setOutput] = useState([])

  const handleRunCode = () => {
    try {
      setOutput([])
      executeCode(code, setOutput)
    } catch (error) {
      setOutput(prev => [...prev, `Error: ${error.message}`])
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        const btn = document.getElementById(`copy-btn-${title}`)
        btn.textContent = '✅ Copied!'
        setTimeout(() => {
          btn.textContent = '📋 Copy'
        }, 2000)
      })
  }

  const highlightedCode = highlight(code, languages.javascript, 'javascript')

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-lg overflow-hidden transition-colors duration-200">
      <div className="bg-secondary-100 dark:bg-secondary-700 px-4 py-2 flex justify-between items-center">
        <h4 className="font-medium text-lg text-secondary-800 dark:text-white">{title}</h4>
        <div className="flex space-x-2">
          <button 
            id={`copy-btn-${title}`}
            className="text-sm bg-secondary-200 dark:bg-secondary-600 px-2 py-1 rounded hover:bg-secondary-300 dark:hover:bg-secondary-500 transition-colors"
            onClick={handleCopyCode}
          >
            📋 Copy
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-secondary-600 dark:text-secondary-300 mb-3">{description}</p>
        
        <pre className="bg-secondary-900 text-white p-3 rounded overflow-x-auto">
          <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        </pre>
        
        <div className="mt-3">
          <button 
            className="btn btn-primary w-full"
            onClick={handleRunCode}
          >
            ▶️ Run Example
          </button>
        </div>
        
        {output.length > 0 && (
          <div className="mt-3">
            <ConsoleOutput output={output} />
          </div>
        )}
      </div>
    </div>
  )
}

export default CodeExample