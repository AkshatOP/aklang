import React from 'react'

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="flex border-b border-secondary-200">
      <button 
        className={`tab ${activeTab === 'playground' ? 'active bg-primary-50 text-primary-600' : 'text-secondary-600 hover:bg-primary-50 hover:text-primary-500'}`}
        onClick={() => setActiveTab('playground')}
      >
        💻 Playground
      </button>
      <button 
        className={`tab ${activeTab === 'documentation' ? 'active bg-primary-50 text-primary-600' : 'text-secondary-600 hover:bg-primary-50 hover:text-primary-500'}`}
        onClick={() => setActiveTab('documentation')}
      >
        📘 Documentation
      </button>
    </nav>
  )
}

export default Navbar