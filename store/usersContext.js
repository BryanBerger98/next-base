import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const UsersContext = createContext(null)
export { UsersContext }

export function useUsersContext() {
    const context = useContext(UsersContext)
    if (context === null) {
        throw new Error('useUsersContext is null')
    }
    if (context === undefined) {
        throw new Error('useUsersContext was used outside of its Provider')
    }
    return context
}

export default function UsersContextProvider(props) {

    const [usersList, setUsersList] = useState(null)
    const [usersCount, setUsersCount] = useState(0)
    const [usersTotal, setUsersTotal] = useState(0)

    const dispatchUsersData = useCallback((users, count, total) => {
        setUsersList(users)
        setUsersCount(count)
        setUsersTotal(total)
    }, [setUsersList])

    const deleteUser = useCallback((userId) => {
        const usersArr = [...usersList]
        const userIndex = usersArr.findIndex(el => el._id === userId)
        usersArr.splice(userIndex, 1)
        let total = usersTotal
        total--
        setUsersList([...usersArr])
        setUsersTotal(total)
    }, [usersList, usersTotal])

    const updateUser = useCallback((user) => {
        const usersArr = [...usersList]
        const userIndex = usersArr.findIndex(el => el._id === user._id)
        if (userIndex === -1) {
            return
        }
        usersArr[userIndex] = user
        setUsersList([...usersArr])
    }, [usersList, setUsersList])

    const contextValues = useMemo(() => ({
        usersList,
        usersCount,
        usersTotal,
        dispatchUsersData,
        setUsersCount,
        deleteUser,
        updateUser
    }), [
        usersList,
        usersCount,
        usersTotal,
        dispatchUsersData,
        setUsersCount,
        deleteUser,
        updateUser
    ])

    return(
        <UsersContext.Provider value={contextValues}>
            {props.children}
        </UsersContext.Provider>
    )

};