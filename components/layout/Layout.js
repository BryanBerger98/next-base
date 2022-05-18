import { useSession } from 'next-auth/react'
import { useAuthContext } from '../../store/authContext'
import { useThemeContext } from '../../store/themeContext'
import { useEffect, useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/router'

export default function Layout(props) {

    const {data: session, status} = useSession()
    const { getCurrentUser, currentUser } = useAuthContext()
    const { theme, toggleTheme } = useThemeContext()
    const [showLayout, setShowLayout] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (session) {
            getCurrentUser()
        }
    }, [session])

    useEffect(() => {
        const pathArr = router.pathname.split('/')
        pathArr.splice(0, 1)
        if ((pathArr[0] === 'auth' && pathArr[1] === 'verify-email') || (pathArr[0] === 'auth' && pathArr[1] === 'reset-password')) {
            setShowLayout(false)
        } else {
            setShowLayout(true)
        }
    }, [router])

    useEffect(() => {
        const darkMode = localStorage.getItem('theme')
        toggleTheme(darkMode)
    }, [])

    useEffect(() => {
        const body = document.getElementsByTagName('body')[0]
        body.className = theme === 'dark' ? 'dark bg-gray-800' : 'bg-gray-50'
    }, [theme])

    // if (status === 'loading') {
    //     return(
    //         <div className="absolute inset-0 z-50 bg-gray-50/30 flex items-center justify-center">
    //             <AiOutlineLoading3Quarters className={`text-6xl text-indigo-500 animate-spin`} />
    //         </div>
    //     )
    // }

    return(
        <div className={`h-full`}>
            {
                status === 'loading' ?
                    <div className="absolute inset-0 z-50 bg-gray-50/30 dark:bg-gray-600/50 flex items-center justify-center">
                        <AiOutlineLoading3Quarters className={`text-6xl text-indigo-500 animate-spin`} />
                    </div>
                : <>
                    <div className='flex h-full'>
                        {
                            session && status === 'authenticated' && showLayout &&
                            <div className='relative w-60'>
                                <Sidebar />
                            </div>
                        }
                        <div className='grow h-full flex flex-col'>
                            { session && status === 'authenticated' && showLayout && <Header currentUser={currentUser} /> }
                            <div className="grow">
                                {props.children}
                            </div>
                        </div>
                    </div>
                    <Toaster position="bottom-right" toastOptions={{duration: 3000}} />
                </>
            }
        </div>
    )
}