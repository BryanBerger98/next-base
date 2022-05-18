import { useRouter } from "next/router"
import { useState, useEffect } from 'react'
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { FiArrowRight, FiCheckCircle, FiX } from "react-icons/fi"
import Button from "../../../components/ui/Button"
import { verifyEmail } from "../../../packages/api/auth"
import useTranslate from "../../../packages/hooks/translate"
import { useAuthContext } from "../../../store/authContext"

export default function VerifyEmailPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)

    const { dispatchCurrentUser, currentUser } = useAuthContext()
    const { getTranslatedError } = useTranslate({locale: 'fr'})
    const { token } = router.query

    useEffect(() => {
      if (token) {
        verifyEmail(token)
        .then(() => {
          setLoading(false)
          setSuccess(true)
          dispatchCurrentUser({email_verified: true})
          setTimeout(() => {
              router.replace('/account')
          }, 3000)
        }).catch(err => {
            setLoading(false)
          if (err.response && err.response.data) {
              const errorMessage = getTranslatedError(err.response.data.code)
              return setError(errorMessage)
          }
          console.error(err)
        })
      }
    }, [token])
    

    return(
        <div className='flex justify-center items-center h-screen'>
             {
                loading &&
                <div className="absolute inset-0 z-50 flex items-center justify-center">
                    <AiOutlineLoading3Quarters className={`text-6xl text-indigo-500 dark:text-indigo-300 ${loading && 'animate-spin'}`} />
                </div>
            }
            {
                !error && !loading && success &&
                <div className="w-11/12 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white dark:bg-gray-900 dark:text-gray-200 drop-shadow rounded-md p-6">
                    <h1 className='text-indigo-500 dark:text-indigo-300 text-center text-3xl mb-3'>Next-Base</h1>
                    <h2 className='text-gray-500 dark:text-gray-300 text-center text-2xl mb-5'>Adresse email vérifiée</h2>
                    <div className="flex items-center justify-center text-green-500 dark:text-green-300 text-6xl mb-5">
                        <FiCheckCircle />
                    </div>
                    <div className="flex flex-col justify-center items-center text-sm">
                        <p className="mb-3">Vous allez être redirigé dans quelques secondes</p>
                        <Button variant={'primary'} href={'/'}>
                            <span>Retour à l'application</span>
                            <FiArrowRight />
                        </Button>
                    </div>
                </div>
            }
            {
                error && !loading && !success &&
                <div className="w-11/12 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white dark:bg-gray-900 drop-shadow rounded-md p-6">
                    <h1 className='text-indigo-500 dark:text-indigo-300 text-center text-3xl mb-3'>Next-Base</h1>
                    <h2 className='text-red-500 dark:text-red-400 text-center text-2xl mb-5'>Une erreur est survenue</h2>
                    <div className="flex items-center justify-center text-red-500 dark:text-red-400 text-6xl mb-5">
                        <FiX />
                    </div>
                    <div className="flex flex-col justify-center items-center text-sm">
                        <p className="mb-3 text-red-500 dark:text-red-400">{error}</p>
                        <Button variant={'primary'} href={'/'}>
                            <span>Retour à l'application</span>
                            <FiArrowRight />
                        </Button>
                    </div>
                </div>
            }
        </div>
    )
}