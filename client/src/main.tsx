import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraThemeProvider } from './components/ChakraThemeProvider'
import './index.css'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraThemeProvider>
      <App />
    </ChakraThemeProvider>
  </React.StrictMode>,
)
