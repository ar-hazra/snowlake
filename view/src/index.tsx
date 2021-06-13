//Import Statements
import ReactDOM from 'react-dom'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.sass'
import { Provider } from 'react-redux'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import store from './redux/Store'

//React Render
ReactDOM.render(
    <Provider store={ store }>
        <App />
    </Provider>, 
    document.getElementById('root')
)

//Service Worker
serviceWorkerRegistration.register()