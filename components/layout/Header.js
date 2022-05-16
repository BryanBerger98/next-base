import { FiSearch } from "react-icons/fi"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import usePageTitleTranslator from '../../helpers/page-title-translator'
import AccountDropDownMenu from "../account/AccountDropdownMenu"

export default function Header({ currentUser }) {

    const [pageTitle, setPageTitle] = useState('')
    const { getTranslatedTitle } = usePageTitleTranslator({locale: 'fr'})

    const router = useRouter()

    useEffect(() => {
        const path = router.pathname
        const pathArray = path.split('/').filter(el => el !== '')
        const title = pathArray.length === 0 ? 'Next-Base' : getTranslatedTitle(pathArray[0])
        setPageTitle(title)
    }, [router, getTranslatedTitle])

    return(
        <div className="w-full bg-white drop-shadow p-4 grid grid-cols-12 gap-2 text-sm relative z-10">
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
                <AccountDropDownMenu currentUser={currentUser} />
            </div>
        </div>
    )
}