import { useState } from 'react'
import Navbar from './components/Navbar'
import Playground from './components/Playground'
import Documentation from './components/Documentation'
import ThemeToggle from './components/ThemeToggle'
import { ThemeProvider  } from './context/ThemeContext'

function App() {
  const [activeTab, setActiveTab] = useState('playground')


  return (
    <ThemeProvider>
      <div className="min-h-screen font-baloo text-secondary-900 dark:text-white bg-white dark:bg-secondary-900 transition-colors duration-200">
        <header className="bg-white dark:bg-secondary-800 shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center mb-4">
              <div className="h-28 overflow-hidden w-fit">
                <img src="aklang.png" alt="AKLang logo" className="h-40 object-cover" />
              </div>
              <ThemeToggle />
            </div>
            <div className={`text-l mt-2 `}>
              AKLang is a toy programming language with desi coding vibes, made with JavaScript. 
              <br />
              <span className="bg-[#2d2d2d] text-white px-2 py-1 font-mono text-lg mt-2 inline-block background-opacity-50 rounded-md">
                `npm i -g aklang`
              </span>
              <br />
              Made by <a href="https://github.com/AkshatOP/" target="_blank" className="text-primary-400"> @Akshat</a>
            </div>
            <br />
            
            
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
