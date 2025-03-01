import React from 'react'
import Hero from './components/Hero.jsx'
import Navbar from './components/Navbar.jsx'
import Boxes from './components/Boxes.jsx'
import { Features } from 'tailwindcss'

const App = () => {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-zinc-600">
      <Navbar />
      <Hero />
      <Boxes />
    </main>
  )
}

export default App