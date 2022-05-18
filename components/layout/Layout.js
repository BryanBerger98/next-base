import { useSession } from 'next-auth/react'
import { useAuthContext } from '../../store/authContext'
import { useEffect } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { Toaster } from 'react-hot-toast'

export default function Layout(props) {

    const {data: session, status} = useSession()
    const { getCurrentUser, currentUser } = useAuthContext()

    useEffect(() => {
        if (session) {
            getCurrentUser()
        }
    }, [session])

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
                    session && status === 'authenticated' && 
                    <div className='relative w-60'>
                        <Sidebar />
                    </div>
                }
                <div className='grow h-full flex flex-col'>
                    { session && status === 'authenticated' && <Header currentUser={currentUser} /> }
                    <div className="grow relative">
                        {props.children}
                    </div>
                </div>
            </div>
            <Toaster position="bottom-right" toastOptions={{duration: 3000}} />
        </>
    )
}