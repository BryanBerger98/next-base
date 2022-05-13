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

    const dispatchUsersData = useCallback((users, count) => {
        setUsersList(users)
        setUsersCount(count)
    }, [setUsersList])

    const deleteUser = useCallback((userId) => {
        const usersArr = [...usersList]
        const userIndex = usersArr.findIndex(el => el._id === userId)
        usersArr.splice(userIndex, 1)
        let count = usersCount
        count--
        setUsersList([...usersArr])
        setUsersCount(count)
    }, [usersList, usersCount])

    const updateUser = useCallback((user) => {
        const usersArr = [...usersList]
        const userIndex = usersArr.findIndex(el => el._id === user._id)
        if (userIndex === -1) {
            return
        }
        console.log(user)
        usersArr[userIndex] = user
        setUsersList([...usersArr])
    }, [usersList, setUsersList])

    const contextValues = useMemo(() => ({
        usersList,
        dispatchUsersData,
        usersCount,
        setUsersCount,
        deleteUser,
        updateUser
    }), [
        usersList,
        dispatchUsersData,
        usersCount,
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