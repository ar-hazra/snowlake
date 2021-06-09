import ReactDOM from 'react-dom'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.sass'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

ReactDOM.render(<App />, document.getElementById('root'))

//Service Worker
serviceWorkerRegistration.register()