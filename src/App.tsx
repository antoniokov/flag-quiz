import { useState } from 'react'
import './App.css'
import FlagQuiz from './components/FlagQuiz'

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>World Flag Quiz</h1>
        <p>Test your knowledge of similar flags around the world</p>
      </header>
      <main>
        <FlagQuiz />
      </main>
    </div>
  )
}

export default App
