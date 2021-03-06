import { FiChevronLeft, FiUser } from "react-icons/fi";
import EditUserForm from "../../../components/users/EditUserForm";
import { useState } from 'react'
import Link from "next/link";
import { connectToDatabase } from "../../../utils/mongodb";
import User from "../../../models/User.model";

export default function EditUserPage(props) {

    const [user, setUser] = useState(props.user)

    return(
        <div className="container mx-auto my-10 text-gray-800 dark:text-gray-200 px-5">
            <div className="flex mb-5 text-sm">
                <Link href={'/users'}>
                    <a className="py-2 rounded-md text-red-500 dark:text-red-400 flex items-center gap-2 hover:underline">
                        <FiChevronLeft />
                        <span>Retour</span>
                    </a>
                </Link>
            </div>
            <div className="grid grid-cols-12">
                <div className="col-span-12 lg:col-span-10 xl:col-span-8 2xl:col-span-6 bg-white dark:bg-gray-900 drop-shadow p-10 rounded-md">
                    <h1 className="flex items-center gap-2 text-xl mb-5 text-indigo-500 dark:text-indigo-300"><FiUser /><span>{props.user && props.user.username && props.user.username !== '' && props.user.username}{(!props.user || !props.user.username || props.user.username === '') && 'Sans nom'}</span></h1>
                    <EditUserForm user={user} setUser={setUser} />
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {

    await connectToDatabase()

    const { userId } = context.params

    const user = await User.findById(userId)

    return {
        props: {
            user: JSON.parse(JSON.stringify(user))
        }
    }

}