import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

export default function Home() {

  const {data: session, status} = useSession()
  const router = useRouter()

  if (status === 'authenticated' && session) {
    router.push('/dashboard')
  } else {
    router.push('/auth/signin')
  }

  return (
    <div>
    </div>    
  )
}
