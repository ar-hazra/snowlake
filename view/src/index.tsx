//Import Statements
import ReactDOM from 'react-dom'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.sass'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

//React Render
ReactDOM.render(<App />, document.getElementById('root'))

//Service Worker
serviceWorkerRegistration.register()