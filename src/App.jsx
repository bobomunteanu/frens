import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Burn from './components/Burn'
import * as buffer from 'buffer'

window.Buffer = buffer.Buffer;

function App() {

  return (
    <>
      <Navbar></Navbar>  
      <Burn></Burn>
    </>
  )
}

export default App
