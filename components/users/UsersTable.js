import { FiCheckCircle, FiLock, FiRotateCw, FiUser } from "react-icons/fi"
import { getStringSlashedDateFromDate } from "../../utils/dates"
import { useState, Fragment, useCallback, useEffect } from 'react'
import UserTableDataMenu from "./UserTableDataMenu"
import { getSession } from "next-auth/react"
import { useUsersContext } from "../../store/usersContext"
import Image from "next/image"
import Table from "../ui/Table"
import { getUsers } from "../../packages/api/users"

export default function UsersTable({searchString}) {

    const { usersList, usersTotal, dispatchUsersData } = useUsersContext()

    const [limit, setLimit] = useState(10)
    const [skip, setSkip] = useState(0)
    const [sort, setSort] = useState({field: 'created_on', direction: -1})

    const tableFields = [
        {
            title: 'Nom',
            name: 'username',
            sortable: true,
            fontStyle: 'semibold',
            align: 'left'
        },
        {
            title: 'Adresse email',
            name: 'email',
            sortable: true,
            fontStyle: 'semibold',
            align: 'left'
        },
        {
            title: 'Télépohne',
            name: 'phone_number',
            sortable: true,
            fontStyle: 'semibold',
            align: 'left'
        },
        {
            title: 'Rôle',
            name: 'role',
            sortable: true,
            fontStyle: 'semibold',
            align: 'left'
        },
        {
            title: 'Date de création',
            name: 'created_on',
            sortable: true,
            fontStyle: 'semibold',
            align: 'left'
        },
        {
            title: 'Actions',
            name: 'actions',
            sortable: false,
            fontStyle: 'semibold',
            align: 'center'
        }
    ]

    const [currentUser, setCurrentUser] = useState(null)
    const [dataLoading, setDataLoading] = useState(false)

    const loadUsersTable = useCallback((limit, skip, sort, searchString) => {
        getUsers(sort, skip, limit, searchString)
        .then(response => {
            dispatchUsersData(response.users, response.count, response.total)
        })
        .catch(console.error)
        .finally(() => setDataLoading(false));
    }, [setDataLoading]);

    
    const reloadTable = (limit, skip, sort) => {
        setLimit(limit)
        setSkip(skip)
        setSort(sort)
        loadUsersTable(limit, skip, sort, searchString)
    }

    useEffect(() => {
        getSession()
        .then(session => {
            if (session) {
                setCurrentUser(session.user)
            }
        })
    }, [setCurrentUser])

    useEffect(() => {
        loadUsersTable(limit, skip, sort, searchString)
    }, [searchString, loadUsersTable])

    useEffect(() => {
        setDataLoading(true)
    }, [setDataLoading])

    return(
        <Fragment>
            <Table dataLoading={dataLoading} dataCount={usersTotal} defaultLimit={limit} defaultSkip={skip} defaultSort={sort} fields={tableFields} onReloadTable={reloadTable}>
                {
                    usersList && usersList.map((user, index) => (
                        <tr key={user._id + '-' + index} className={`${user.disabled ? 'text-gray-400' : ''}`}>
                            <td className="py-3 border-b-[0.5px] border-gray-300">
                                <span className="flex items-center gap-2">
                                    <div className="h-10 w-10 rounded-full drop-shadow bg-indigo-500 text-gray-50 flex justify-center items-center text-lg overflow-hidden relative">
                                        {
                                            user.photo_url && user.photo_url !== ''
                                            ? <Image className="rounded-full" src={`/${user.photo_url}`} alt={`${user.username ? user.username : user._id} profile photo`} height={40} width={40} />
                                            : <FiUser />
                                        }
                                        {
                                            user.disabled &&
                                            <div className="absolute inset-0 bg-gray-50/75 flex justify-center items-center rounded-full">
                                                <FiLock title='Compte désactivé' className="text-red-500 text-lg" />
                                            </div>
                                        }
                                    </div>
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
                                {user.phone_number && user.phone_number.length > 0 ? <span>{user.phone_number}</span> : ''}
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
            </Table>
        </Fragment>
    )
}