import React from 'react'

const ConsoleOutput = ({ output }) => {
  return (
    <div className="console-output mt-4">
      <div className="flex items-center mb-2 border-b border-secondary-700 pb-2">
        <span className="bg-error-500 h-3 w-3 rounded-full mr-2"></span>
        <span className="bg-warning-500 h-3 w-3 rounded-full mr-2"></span>
        <span className="bg-success-500 h-3 w-3 rounded-full mr-2"></span>
        <span className="text-secondary-400 text-sm">Console Output</span>
      </div>
      {output.length === 0 ? (
        <p className="text-secondary-400 italic">Output will appear here...</p>
      ) : (
        <ul>
          {output.map((item, index) => (
            <li 
              key={index} 
              className="console-item" 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {typeof item === 'object' ? JSON.stringify(item) : item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ConsoleOutput