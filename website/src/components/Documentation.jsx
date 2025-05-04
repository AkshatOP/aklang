import React, { useState } from 'react'
import CodeExample from './CodeExample'
import { documentationData } from '../data/documentationData'

const Documentation = () => {
  return (
    <div className="animate-fade-in">
      <div className="bg-[#1f2937] rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-secondary-800">
          <span className="text-neela">AK</span>
          <span className="text-bhagwa">Lang</span> 
          <span className="text-hara"> Documentation</span>
        </h2>
        <p className="mb-4 text-[#FFFFFF]">
          Learn AKLang with these examples! Click &quot;Run&quot; on any example to see what it does.
        </p>
      </div>

      <div className="space-y-8">
        {documentationData.map((section, index) => (
          <div key={index} className="rangoli-card">
            <h3 className="text-xl font-bold mb-4 text-white">
              {section.title}
            </h3>
            <p className="mb-4 text-[#ffffff5e]">{section.description}</p>
            
            <div className="space-y-4">
              {section.examples.map((example, i) => (
                <CodeExample 
                  key={i}
                  title={example.title}
                  code={example.code}
                  description={example.description}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Documentation