import { useSession } from 'next-auth/react'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout(props) {

    const {data: session, status} = useSession()

    if (status === 'loading') {
        return <p>Loading...</p>
    }

    return(
        <div className='flex bg-gray-50 h-full'>
            {
                session && status === 'authenticated' && 
                <div className='relative w-60'>
                    <Sidebar />
                </div>
            }
            <div className='grow h-full flex flex-col'>
                { session && status === 'authenticated' && <Header currentSession={session} /> }
                <div className="grow">
                    {props.children}
                </div>
            </div>
        </div>
    )
}