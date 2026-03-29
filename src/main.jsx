import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'

//react cerca nel DOM l'elemento con id root (presente in index.html) 
//lo prende e lo usa per la gestione del redering per dirgli cosa mostrare a schermo
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
