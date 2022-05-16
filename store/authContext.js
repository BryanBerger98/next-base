import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { getSession } from 'next-auth/react'
import axios from 'axios'

const AuthContext = createContext(null)
export { AuthContext }

export function useAuthContext() {
    const context = useContext(AuthContext)
    if (context === null) {
        throw new Error('useAuthContext is null')
    }
    if (context === undefined) {
        throw new Error('useAuthContext was used outside of its Provider')
    }
    return context
}

export default function AuthContextProvider(props) {

    const [currentUser, setCurrentUser] = useState(null)

    const getCurrentUser = useCallback(async () => {
        try {
            const response = await axios.get('/api/auth/current-user')
            setCurrentUser(response.data)
            return response.data
        } catch (error) {
            throw error
        }
    }, [setCurrentUser])

    const dispatchCurrentUser = useCallback(async (user) => {
        setCurrentUser(user)
    }, [setCurrentUser])

    const contextValues = useMemo(() => ({
        currentUser,
        getCurrentUser,
        dispatchCurrentUser
    }), [
        currentUser,
        getCurrentUser,
        dispatchCurrentUser
    ])

    return(
        <AuthContext.Provider value={contextValues}>
            {props.children}
        </AuthContext.Provider>
    )

};