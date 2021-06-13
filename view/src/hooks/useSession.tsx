//Import Statements
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../redux/UserActions'

//Session Hook
const useSession = () =>
{
    const [state, setState] = useState({ name: '', prototypeCount: 0, isLoaded: false, hasError: false })
    const user = useSelector((state: any) => state.user)
    const  dispatch = useDispatch()

    useEffect(() => 
    {
        let authAPI = async() =>
        {
            if(user.name === '')
            {
                axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('token') 
        
                try 
                {
                    const response = await axios.get('/api/account/dashboard')
                    dispatch(setUser(response.data))
                    setState({ name: response.data.user.name, prototypeCount: response.data.prototypeCount, isLoaded: true, hasError: false })
                } 
                
                catch (error) 
                {
                    localStorage.removeItem('token')
                    setState({ name: '', prototypeCount: 0, isLoaded: true, hasError: true })
                }
            }

            else
            {
                setState({ name: user.name, prototypeCount: user.prototypeCount, isLoaded: true, hasError: false })
            }
        }

        authAPI()
    }, [])


    return state
}

//Export Statement
export default useSession