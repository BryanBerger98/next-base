import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { getSession } from 'next-auth/react'

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

    const [currentSession, setCurrentSession] = useState(null)

    const getCurrentSession = useCallback(async () => {
        try {
            const session = await getSession()
            setCurrentSession(session)
            return session
        } catch (error) {
            throw error
        }
    }, [])

    const contextValues = useMemo(() => ({
        currentSession,
        getCurrentSession
    }), [
        currentSession,
        getCurrentSession
    ])

    return(
        <AuthContext.Provider value={contextValues}>
            {props.children}
        </AuthContext.Provider>
    )

};