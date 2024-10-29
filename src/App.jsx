import { useState } from 'react'
import './App.css'
import Walletconnection from './components/Walletconnection'
import TokenLaunch from './components/TokenLaunch'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Walletconnection>
      <TokenLaunch/>
     </Walletconnection>
    </>
  )
}

export default App
