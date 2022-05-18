import { useSession } from 'next-auth/react'
import { useAuthContext } from '../../store/authContext'
import { useEffect, useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/router'

export default function Layout(props) {

    const {data: session, status} = useSession()
    const { getCurrentUser, currentUser } = useAuthContext()
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
        if (pathArr[0] === 'auth' && pathArr[1] === 'verify-email') {
            setShowLayout(false)
        } else {
            setShowLayout(true)
        }
    }, [router])

    if (status === 'loading') {
        return(
            <div className="absolute inset-0 z-50 bg-gray-50/30 flex items-center justify-center">
                <AiOutlineLoading3Quarters className={`text-6xl text-indigo-500 animate-spin`} />
            </div>
        )
    }

    return(
        <>
            <div className='flex bg-gray-50 h-full'>
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
    )
}