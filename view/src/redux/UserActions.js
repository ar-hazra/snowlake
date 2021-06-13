//User Actions
export const setUser = (data) =>
{
    return {
        type: 'SET_USER',
        payload: data
    }
}

export const resetUser = () =>
{
    return {
        type: 'RESET_USER'
    }
}