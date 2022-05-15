import { FiArrowDown, FiArrowUp, FiCheckCircle, FiLock, FiRotateCw } from "react-icons/fi"
import { getStringSlashedDateFromDate } from "../../utils/dates"
import { useState, Fragment, useCallback, useEffect } from 'react'
import axios from "axios"
import TablePageSelector from "../ui/TablePageSelector"
import UserTableDataMenu from "./UserTableDataMenu"
import { getSession } from "next-auth/react"
import { useUsersContext } from "../../store/usersContext"

async function getUsers(sort, skip, limit, searchString) {
    try {
        const response = await axios.get(`/api/users?sortField=${sort.field}&sortDirection=${sort.direction}&limit=${limit}&skip=${skip}${searchString && searchString.length > 0 ? '&search=' + searchString : ''}`, {
            withCredentials: true
        })
        const users = response && response.data && response.data.users ? response.data.users : []
        const count = response && response.data && response.data.count ? response.data.count : 0
        const total = response && response.data && response.data.total ? response.data.total : 0 
        
        return {
            users,
            count,
            total
        }
    } catch (error) {
        throw error
    }
}

export default function UsersTable({searchString}) {

    const { usersList, usersTotal, dispatchUsersData } = useUsersContext()

    const [currentUser, setCurrentUser] = useState(null)

    const [limit, setLimit] = useState(10)
    const [skip, setSkip] = useState(0)
    const [sort, setSort] = useState({field: 'email', direction: -1})

    const [dataLoading, setDataLoading] = useState(false)

    const loadUsersTable = useCallback((limit, skip, sort, searchString) => {
        getUsers(sort, skip, limit, searchString)
        .then(response => {
            dispatchUsersData(response.users, response.count, response.total)
        })
        .catch(console.error)
        .finally(() => setDataLoading(false));
    }, [setDataLoading]);

    const onChangeSort = (field, direction) => {
        setSort({field, direction})
    }

    useEffect(() => {
        getSession()
        .then(session => {
            if (session) {
                setCurrentUser(session.user)
            }
            console.log(session)
        })
    }, [setCurrentUser])

    useEffect(() => {
        loadUsersTable(limit, skip, sort, searchString)
    }, [limit, skip, sort, searchString, loadUsersTable])

    useEffect(() => {
        setDataLoading(true)
    }, [setDataLoading])

    return(
        <Fragment>
            <table className="w-full text-sm">
                <thead>
                    <tr>
                        <th className="text-left font-semibold border-b border-gray-400 py-2 hover:cursor-pointer" onClick={() => onChangeSort('username', sort.direction === 1 ? -1 : 1)}>
                            <span className="flex gap-1 items-center">
                                <span>Nom</span>
                                {sort.field === 'username' && sort.direction === 1 && <FiArrowUp />}
                                {sort.field === 'username' && sort.direction === -1 && <FiArrowDown />}
                            </span>
                        </th>
                        <th className="text-left font-semibold border-b border-gray-400 py-2 hover:cursor-pointer" onClick={() => onChangeSort('email', sort.direction === 1 ? -1 : 1)}>
                            <span className="flex gap-1 items-center">
                                <span>Adresse email</span>
                                {sort.field === 'email' && sort.direction === 1 && <FiArrowUp />}
                                {sort.field === 'email' && sort.direction === -1 && <FiArrowDown />}
                            </span>
                        </th>
                        <th className="text-left font-semibold border-b border-gray-400 py-2 hover:cursor-pointer" onClick={() => onChangeSort('phone_number', sort.direction === 1 ? -1 : 1)}>
                            <span className="flex gap-1 items-center">
                                <span>Téléphone</span>
                                {sort.field === 'phone_number' && sort.direction === 1 && <FiArrowUp />}
                                {sort.field === 'phone_number' && sort.direction === -1 && <FiArrowDown />}
                            </span>
                        </th>
                        <th className="text-left font-semibold border-b border-gray-400 py-2 hover:cursor-pointer" onClick={() => onChangeSort('role', sort.direction === 1 ? -1 : 1)}>
                            <span className="flex gap-1 items-center">
                                <span>Rôle</span>
                                {sort.field === 'role' && sort.direction === 1 && <FiArrowUp />}
                                {sort.field === 'role' && sort.direction === -1 && <FiArrowDown />}
                            </span>
                        </th>
                        <th className="text-left font-semibold border-b border-gray-400 py-2 hover:cursor-pointer" onClick={() => onChangeSort('created_on', sort.direction === 1 ? -1 : 1)}>
                            <span className="flex gap-1 items-center">
                                <span>Date de création</span>
                                {sort.field === 'created_on' && sort.direction === 1 && <FiArrowUp />}
                                {sort.field === 'created_on' && sort.direction === -1 && <FiArrowDown />}
                            </span>
                        </th>
                        <th className="text-center font-semibold border-b border-gray-400 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                {
                        !dataLoading && usersList && usersList.map((user, index) => (
                            <tr key={user._id + '-' + index} className={`${user.disabled ? 'bg-gray-200 text-gray-400' : ''}`}>
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <span className="flex items-center gap-1">
                                        {user.disabled && <FiLock title='Compte désactivé' className="text-rose-500 text-md ml-1" />}
                                        {user.username && user.username.length > 0 ? <span>{user.username}</span> : <span className="italic text-gray-400">Sans nom</span>}
                                    </span>
                                </td>
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <span className="flex items-center gap-1">
                                        <span>{user.email}</span>
                                        {user.email_verified ? <FiCheckCircle title='Compte vérifié' className="text-green-600" /> : <FiRotateCw title="En attente de vérification" className="text-yellow-600" />}
                                    </span>
                                </td>
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    {user.phone_number && user.phone_number.length > 0 ? <span>user.phone_number</span> : ''}
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300">
                                    {user.role === 'admin' ? 'Administrateur' : user.role === 'user' ? 'Utilisateur' : ''}
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300">
                                    {user.created_on && getStringSlashedDateFromDate(new Date(user.created_on), 'fr')}
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300 text-center">
                                    <UserTableDataMenu user={user} currentUser={currentUser} />
                                </td>
                            </tr>
                        ))
                    }
                    {
                        dataLoading && <>
                            <tr className="animate-pulse">
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-44 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-64 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-36 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300">
                                    <div className="w-28 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300">
                                    <div className="w-28 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300 text-center">
                                    <div className="w-10 mx-auto bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                            </tr>
                            <tr className="animate-pulse">
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-44 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-64 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-36 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300">
                                    <div className="w-28 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300">
                                    <div className="w-28 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300 text-center">
                                    <div className="w-10 mx-auto bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                            </tr>
                            <tr className="animate-pulse">
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-44 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-64 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-36 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300">
                                    <div className="w-28 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300">
                                    <div className="w-28 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300 text-center">
                                    <div className="w-10 mx-auto bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                            </tr>
                            <tr className="animate-pulse">
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-44 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-64 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-36 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300">
                                    <div className="w-28 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300">
                                    <div className="w-28 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300 text-center">
                                    <div className="w-10 mx-auto bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                            </tr>
                            <tr className="animate-pulse">
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-44 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-64 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-36 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300">
                                    <div className="w-28 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300">
                                    <div className="w-28 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300 text-center">
                                    <div className="w-10 mx-auto bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                            </tr>
                            <tr className="animate-pulse">
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-44 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-64 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-36 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300">
                                    <div className="w-28 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300">
                                    <div className="w-28 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300 text-center">
                                    <div className="w-10 mx-auto bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                            </tr>
                            <tr className="animate-pulse">
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-44 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-64 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-36 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300">
                                    <div className="w-28 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300">
                                    <div className="w-28 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300 text-center">
                                    <div className="w-10 mx-auto bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                            </tr>
                            <tr className="animate-pulse">
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-44 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-64 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-36 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300">
                                    <div className="w-28 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300">
                                    <div className="w-28 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300 text-center">
                                    <div className="w-10 mx-auto bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                            </tr>
                            <tr className="animate-pulse">
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-44 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-64 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-36 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300">
                                    <div className="w-28 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300">
                                    <div className="w-28 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300 text-center">
                                    <div className="w-10 mx-auto bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                            </tr>
                            <tr className="animate-pulse">
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-44 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-64 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-3 border-b-[0.5px] border-gray-300">
                                    <div className="w-36 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300">
                                    <div className="w-28 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300">
                                    <div className="w-28 bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300 text-center">
                                    <div className="w-10 mx-auto bg-gray-300 h-5 rounded-md">

                                    </div>
                                </td>
                            </tr>
                        </>
                    }
                </tbody>
            </table>
            {!dataLoading && <TablePageSelector arrayLength={usersTotal} limit={limit} setLimit={setLimit} skip={skip} setSkip={setSkip} />}
        </Fragment>
    )
}