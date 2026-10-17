import React from 'react'
import Hero from './components/Hero.jsx'
import Navbar from './components/Navbar.jsx'
import Boxes from './components/Boxes.jsx'
import Stars from './components/Stars.jsx'
import Contact from './components/Contact.jsx'
import { Features } from 'tailwindcss'

const App = () => {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Boxes />
      <Contact />
      <Stars />
    </main>
  )
}

export default App