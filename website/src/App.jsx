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

        {/* <footer className="bg-secondary-900 text-white py-4 mt-8">
          <div className="container mx-auto px-4 text-center">
            <p>
              AKLang Playground &copy; {new Date().getFullYear()} | 
              <span className="ml-2 text-primary-400">Made with ❤️ by AK</span>
            </p>
          </div>
        </footer> */}
        <footer className="bg-secondary-900 text-white py-4 mt-8">
  <div className="container mx-auto px-4 flex items-center justify-between">
    <p>
      AKLang Playground &copy; {new Date().getFullYear()} | 
      <span className="ml-2 text-primary-400">Made with ❤️ by AK</span>
    </p>
    <div className="flex space-x-4">
      <a
        href="https://github.com/AkshatOP"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:text-primary-400"
        aria-label="GitHub"
      >
        {/* GitHub SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 008.205 11.433c.6.11.82-.26.82-.577v-2.234c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.746.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.834 2.806 1.304 3.49.996.108-.775.42-1.305.762-1.605-2.665-.3-5.466-1.334-5.466-5.933 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 016 0c2.29-1.553 3.296-1.23 3.296-1.23.655 1.653.243 2.873.12 3.176.77.84 1.236 1.91 1.236 3.22 0 4.61-2.804 5.63-5.475 5.922.43.37.81 1.103.81 2.222v3.293c0 .32.218.694.825.576A12.003 12.003 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      </a>

      <a
        href="https://linkedin.com/in/akshat-baranwal-02270b32b"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:text-primary-400"
        aria-label="LinkedIn"
      >
        {/* LinkedIn SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.327-.026-3.036-1.849-3.036-1.851 0-2.134 1.445-2.134 2.939v5.666H9.355V9h3.414v1.561h.049c.476-.9 1.637-1.849 3.367-1.849 3.6 0 4.267 2.37 4.267 5.455v6.285zM5.337 7.433c-1.144 0-2.07-.926-2.07-2.07 0-1.144.926-2.07 2.07-2.07s2.07.926 2.07 2.07c0 1.144-.926 2.07-2.07 2.07zM6.814 20.452H3.86V9h2.954v11.452zM22.225 0H1.771C.792 0 0 .775 0 1.732v20.535C0 23.225.792 24 1.771 24h20.451C23.204 24 24 23.225 24 22.267V1.732C24 .775 23.204 0 22.225 0z" />
        </svg>
      </a>
    </div>
  </div>
</footer>

      </div>
    </ThemeProvider>
  )
}

export default App
