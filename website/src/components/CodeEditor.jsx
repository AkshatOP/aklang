import React from 'react'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism-tomorrow.css'

const CodeEditor = ({ code, setCode }) => {
  return (
    <div className="code-editor-container">
      <Editor
        value={code}
        onValueChange={code => setCode(code)}
        highlight={code => highlight(code, languages.javascript, 'javascript')}
        padding={16}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 16,
          backgroundColor: '#1f2937',
          borderRadius: '0.5rem',
          minHeight: '200px',
        }}
        className="code-editor"
      />
    </div>
  )
}

export default CodeEditor