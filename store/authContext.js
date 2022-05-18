import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { getCurrentLoggedInUser } from '../packages/api/auth'

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
            const user = await getCurrentLoggedInUser()
            setCurrentUser(user)
            return user
        } catch (error) {
            throw error
        }
    }, [setCurrentUser])

    const dispatchCurrentUser = useCallback(async (user) => {
        setCurrentUser({...currentUser, ...user})
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