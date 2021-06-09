//Import Statements
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import useDetectOffline from 'use-detect-offline'
import Home from './components/Home'
import { SignUp, SignIn, PasswordReset, SignOut } from './components/Authentication'
import { Dashboard, UpdateAccount, CloseAccount } from './components/Account'
import { Library, NewPrototype, SearchPrototype, UpdatePrototype, ViewPrototype } from './components/Prototype'
import Error from './reusables/Error'
import Offline from './reusables/Offline'
import './types.d.ts'

//Main App Component
const App = () =>
{
    const { offline } = useDetectOffline()

    if(offline)
    {
        return(<Offline />)
    }

    else
    {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path = '/' component = { Home } />
                    <Route exact path = '/auth/signup' component={ SignUp } />
                    <Route exact path = '/auth/signin' component={ SignIn } />
                    <Route exact path = '/auth/pwreset' component={ PasswordReset } />
                    <Route exact path = '/auth/signout' component={ SignOut } />
                    <Route exact path = '/account/dashboard' component={ Dashboard } />
                    <Route exact path = '/account/update' component={ UpdateAccount } />
                    <Route exact path = '/account/close' component={ CloseAccount } />
                    <Route exact path = '/prototype/new' component={ NewPrototype } />
                    <Route exact path = '/prototype/library' component={ Library } />
                    <Route exact path = '/prototype/view/:id' component={ ViewPrototype } />
                    <Route exact path = '/prototype/search' component={ SearchPrototype } />
                    <Route exact path = '/prototype/update/:id' component={ UpdatePrototype } />
                    <Route component={ Error } />
                </Switch>
            </BrowserRouter>
        )
    }
}

//Export Statement
export default App