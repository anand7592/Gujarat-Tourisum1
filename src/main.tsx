import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' // Or your global css file
// 1. Import BrowserRouter
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext' // Don't forget your AuthProvider!

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. Wrap everything in BrowserRouter */}
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)