import React from 'react'
import ReactDOM from 'react-dom'

import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import './assets/fonts/global.css';



//import './index.css'
//const element = (
    //<div id="app" className='container'>hello</div>
//)
import App from './App'
const root = document.getElementById('root')
ReactDOM.render(<App />, root)