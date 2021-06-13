//Initial State
const initialState = 
{
    _id: '',
    name: '',
    email: '',
    prototypeCount: ''
}

//User Reducer
export const userReducer = (state=initialState, action) =>
{
    switch (action.type) 
    {
        case 'SET_USER':
            return { 
                _id: action.payload.user._id,
                name: action.payload.user.name,
                email: action.payload.user.email,
                prototypeCount: action.payload.prototypeCount
            }

        case 'RESET_USER':
            return {
                _id: '',
                name: '',
                email: '',
                prototypeCount: ''
            }
        
        default:
            return state
    }
}