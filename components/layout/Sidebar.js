import Link from "next/link";
import { FiHome, FiUsers } from "react-icons/fi";

export default function Sidebar() {

    return(
        <div className="w-60 bg-indigo-500 fixed inset-y-0 left-0 z-50 flex flex-col p-3">
            <p className="text-gray-50 text-2xl mx-auto my-2 border-b border-gray-50 pb-2">Next-Base</p>
            <nav className="mt-10 text-indigo-100 text-sm">
                <small>NAVIGATION</small>
                <ul>
                    <li>
                        <Link href={'/dashboard'}>
                            <a className="flex gap-2 items-center p-2 rounded-md hover:text-gray-50 hover:bg-indigo-400 hover:cursor-pointer">
                                <FiHome />
                                <span>Tableau de bord</span>
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/users'}>
                            <a className="flex gap-2 items-center p-2 rounded-md hover:text-gray-50 hover:bg-indigo-400 hover:cursor-pointer">
                                <FiUsers />
                                <span>Utilisateurs</span>
                            </a>
                        </Link>
                    </li>
                </ul>
            </nav>
            <small className="mt-auto mx-auto text-xs text-indigo-200">Designed by WeBerger</small>
        </div>
    )
}