import { FiSearch, FiUser } from "react-icons/fi"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import usePageTitleTranslator from '../../helpers/page-title-translator'
import { signOut } from "next-auth/react"

export default function Header({ currentSession }) {

    console.log(currentSession)

    const [pageTitle, setPageTitle] = useState('')
    const { getTranslatedTitle } = usePageTitleTranslator({locale: 'fr'})

    const router = useRouter()

    function logoutHandler() {
        signOut()
      }

    useEffect(() => {
        const path = router.pathname
        const pathArray = path.split('/').filter(el => el !== '')
        const title = pathArray.length === 0 ? 'Next-Base' : getTranslatedTitle(pathArray[0])
        setPageTitle(title)
    }, [router, getTranslatedTitle])

    return(
        <div className="w-full bg-white drop-shadow p-4 grid grid-cols-12 gap-2 text-sm">
            <div className="col-span-3 flex justify-start items-center">
                <p className="text-gray-400">{pageTitle.toUpperCase()}</p>
            </div>
            <div className="col-span-6">
                <div className="w-full flex relative">
                    <input type="search" placeholder="Rechercher..." className="bg-gray-100 placeholder:text-gray-400 p-2 rounded-md grow" />
                    <FiSearch className="absolute right-0 inset-y-0 my-auto mr-2 text-gray-400" />
                </div>
            </div>
            <div className="col-span-3 flex justify-end items-center">
                <div className="bg-indigo-500 flex items-center justify-center text-md text-slate-50 rounded-full w-9 h-9" onClick={logoutHandler}>
                    <FiUser />
                </div>
            </div>
        </div>
    )
}