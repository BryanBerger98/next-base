import { FiMenu, FiSearch } from "react-icons/fi"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import AccountDropDownMenu from "../account/AccountDropdownMenu"
import useTranslate from "../../packages/hooks/translate"
import ThemeToggleSwitch from "../ui/ThemeToggleSwitch"

export default function Header({ currentUser, isSidebarOpen, setIsSidebarOpen }) {

    const [pageTitle, setPageTitle] = useState('')
    const { getTranslatedTitle } = useTranslate({locale: 'fr'})

    const router = useRouter()

    useEffect(() => {
        const path = router.pathname
        const pathArray = path.split('/').filter(el => el !== '')
        const title = pathArray.length === 0 ? 'Next-Base' : getTranslatedTitle(pathArray[0])
        setPageTitle(title)
    }, [router, getTranslatedTitle])

    return(
        <div className="w-full bg-white dark:bg-gray-700 drop-shadow p-3 grid grid-cols-12 gap-2 text-sm relative z-10">
            <div className="col-span-2 lg:col-span-3 flex justify-start items-center">
                <p className="hidden lg:block text-gray-400 dark:text-indigo-50">{pageTitle.toUpperCase()}</p>
                <span className="lg:hidden text-gray-400 text-xl" onClick={() => setIsSidebarOpen(!isSidebarOpen)}><FiMenu /></span>
            </div>
            <div className="col-span-8 lg:col-span-6">
                <div className="w-full flex relative">
                    <input type="search" placeholder="Rechercher..." className="bg-gray-100 dark:bg-gray-800 dark:text-gray-50 placeholder:text-gray-400 p-2 rounded-md grow shadow-inner" />
                    <FiSearch className="absolute right-0 inset-y-0 my-auto mr-2 text-gray-400" />
                </div>
            </div>
            <div className="col-span-2 lg:col-span-3 flex justify-end items-center lg:gap-8">
                <div className="hidden lg:block">
                    <ThemeToggleSwitch />
                </div>
                <AccountDropDownMenu currentUser={currentUser} />
            </div>
        </div>
    )
}