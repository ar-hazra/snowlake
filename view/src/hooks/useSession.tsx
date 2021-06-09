//Import Statements
import { useState, useEffect } from 'react'
import axios from 'axios'

//Session Hook
const useSession = () =>
{
    const [state, setState] = useState({ name: '', prototypeCount: 0, mfa: '', isLoaded: false, hasError: false })

    useEffect(() => 
    {
        let authAPI = async() =>
        {
            axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('token') 
        
            try 
            {
                const response = await axios.get('/api/account/dashboard')
                setState({ name: response.data.user.name, prototypeCount: response.data.prototypeCount, mfa: response.data.user.mfa, isLoaded: true, hasError: false })
            } 
            
            catch (error) 
            {
                localStorage.removeItem('token')
                setState({ name: '', prototypeCount: 0, mfa: '', isLoaded: true, hasError: true })
            }
        }

        authAPI()
    }, [])


    return state
}

//Export Statement
export default useSession