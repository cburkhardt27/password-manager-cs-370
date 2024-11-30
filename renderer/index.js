/*import React from 'react'
import ReactDOM from 'react-dom/client'
import App1 from './App1.js' 

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <h1>Test</h1>
    <App1 />
  </React.StrictMode>
)*/

import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App1.js'

const container = document.getElementById('root')
createRoot(container).render(<App />)