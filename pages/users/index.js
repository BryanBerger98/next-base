import Link from "next/link"
import { FiPlus, FiSearch, FiUsers } from "react-icons/fi"
import { useEffect } from "react"
import UsersTable from "../../components/users/UsersTable"
import User from "../../models/User.model"
import { useUsersContext } from "../../store/usersContext"
import { connectToDatabase } from "../../utils/mongodb"

export default function UsersPage(props) {

    const { dispatchUsersData } = useUsersContext()
    
    useEffect(() => {
        dispatchUsersData(props.users, props.count)
    }, [dispatchUsersData])

    return(
        <div className="container mx-auto my-10 text-gray-800">
            <h1 className="flex items-center gap-2 text-xl mb-5"><FiUsers /><span>Utilisateurs</span></h1>
            <div className="w-full min-h-96 bg-white drop-shadow rounded-md p-3 text-sm">
                <div className="grid grid-cols-12 mb-5">
                    <div className="col-span-6 flex relative">
                        <input type="search" placeholder="Rechercher..." className="bg-gray-100 placeholder:text-gray-400 p-2 rounded-md grow" />
                        <FiSearch className="absolute right-0 inset-y-0 my-auto mr-2 text-gray-400" />
                    </div>
                    <div className="col-span-6 flex">
                        <Link href={'/users/edit'}>
                            <a className="rounded-md bg-indigo-500 text-gray-50 flex gap-2 items-center hover:bg-indigo-600 px-3 py-2 ml-auto">     
                                <FiPlus />
                                <span>Nouveau</span>
                            </a>
                        </Link>
                    </div>
                </div>
                <UsersTable users={props.users}/>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    await connectToDatabase()

    let request = [
        {
            $project: {
                password: 0
            }
        },
        {
            $project: {
                id: '$_id',
                email: 1,
                email_verified: 1,
                username: 1,
                role: 1,
                phone_number: 1,
                disabled: 1,
                provider_data: 1,
                created_on: 1
            }
        },
        {
            $sort: {
                _id: -1
            }
        },
        {
            $facet: {
                metadata: [
                    {$count: 'total'}
                ],
                data: [
                    {
                        limit: 10
                    }
                ]
            }
        }
    ]

    // const result = await User.aggregate(request)

    const users = await User.find().sort({ _id: -1 }).limit(10).lean()
    const count = await User.find().count()

    return {
        props: {
            users: JSON.parse(JSON.stringify(users)),
            count
        }
    }
}