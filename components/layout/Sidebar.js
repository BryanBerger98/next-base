import Link from "next/link";
import { FiHome, FiUsers } from "react-icons/fi";

export default function Sidebar({isSidebarOpen, setIsSidebarOpen}) {

    return(
        <>
            <div className={`relative w-fit lg:w-96`}>
                <div className={`${isSidebarOpen ? 'w-52 p-3' : 'w-0'} lg:w-96 bg-indigo-500 dark:bg-gray-900 fixed inset-y-0 left-0 z-50 flex flex-col lg:p-3 overflow-hidden transition duration-300 ease-in-out`}>
                    <p className="text-gray-50 dark:text-indigo-300 text-2xl mx-auto my-2 border-b border-gray-50 dark:border-indigo-300 pb-2">Next-Base</p>
                    <nav className="mt-10 text-indigo-100 text-sm">
                        <small>NAVIGATION</small>
                        <ul>
                            <li>
                                <Link href={'/dashboard'}>
                                    <a className="flex gap-2 items-center p-2 rounded-md hover:text-gray-50 hover:bg-indigo-400 dark:hover:bg-gray-700 hover:cursor-pointer">
                                        <FiHome />
                                        <span>Tableau de bord</span>
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href={'/users'}>
                                    <a className="flex gap-2 items-center p-2 rounded-md hover:text-gray-50 hover:bg-indigo-400 dark:hover:bg-gray-700 hover:cursor-pointer">
                                        <FiUsers />
                                        <span>Utilisateurs</span>
                                    </a>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <small className="mt-auto mx-auto text-xs text-indigo-200">Designed by WeBerger</small>
                </div>
            </div>
            {
                isSidebarOpen && <div className="fixed inset-0 z-40 bg-gray-800/30 dark:bg-gray-600/50" onClick={() => setIsSidebarOpen(false)}></div>
            }
        </>
    )
}