import { useState } from 'react'
import Navbar from './components/Navbar'
import Playground from './components/Playground'
import Documentation from './components/Documentation'
import ThemeToggle from './components/ThemeToggle'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  const [activeTab, setActiveTab] = useState('playground')

  return (
    <ThemeProvider>
      <div className="min-h-screen font-baloo text-secondary-900 dark:text-white bg-white dark:bg-secondary-900 transition-colors duration-200">
        <header className="bg-white dark:bg-secondary-800 shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-4xl font-bold text-center text-primary-600">
                <span className="text-bhagwa">AK</span>
                <span className="text-neela">Lang</span> 
                <span className="text-hara">Playground</span>
              </h1>
              <ThemeToggle />
            </div>
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {activeTab === 'playground' ? <Playground /> : <Documentation />}
        </main>

        <footer className="bg-secondary-900 text-white py-4 mt-8">
          <div className="container mx-auto px-4 text-center">
            <p>
              AKLang Playground &copy; {new Date().getFullYear()} | 
              <span className="ml-2 text-primary-400">Made with ❤️ by AK</span>
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}

export default App