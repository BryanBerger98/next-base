import { FiAlertTriangle, FiCheck, FiSend, FiX } from "react-icons/fi"
import { sendVerifyAccountEmailToUser } from "../../packages/api/auth"
import ButtonWithLoader from "../ui/ButtonWithLoader"
import { useState } from 'react'
import useTranslate from "../../packages/hooks/translate"
import toast from "react-hot-toast"

export default function AccountEmailVerification() {

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const [counter, setCounter] = useState(60)

    const { getTranslatedError } = useTranslate({locale: 'fr'})

    const startCountDown = (delay) => {
        setCounter(delay)
        const timer = setInterval(() => {
            delay--
            setCounter(delay)
            if (delay === 0) {
                clearInterval(timer)
                setEmailSent(false)
            }
        }, 1000)
    }

    const handleSendVerificationEmail = async () => {
        setLoading(true)
        setError(null)
        try {
            await sendVerifyAccountEmailToUser()
            toast.custom(
                <div className='flex items-center gap-4 bg-indigo-500 text-gray-50 text-medium text-base px-5 py-3 rounded-md drop-shadow'>
                  <FiSend /><span>Email envoyé !</span>
                </div>
            )
            setLoading(false)
            startCountDown(60)
            setEmailSent(true)
        } catch (err) {
            setLoading(false)
            if (err.response && err.response.data && err.response.data.code) {
                const errorMessage = getTranslatedError(err.response.data.code)
                setError(errorMessage)
                toast.custom(
                    <div className='flex items-center gap-4 bg-red-500 text-gray-50 text-medium text-base px-5 py-3 rounded-md drop-shadow'>
                      <FiX /><span>{errorMessage}</span>
                    </div>
                )
            } else {
                console.error(error)
                toast.custom(
                    <div className='flex items-center gap-4 bg-red-500 text-gray-50 text-medium text-base px-5 py-3 rounded-md drop-shadow'>
                      <FiX /><span>Une erreur est survenue</span>
                    </div>
                )
            }
        }
    }

    return(
        <div className="p-5 bg-white drop-shadow mb-5 rounded-md flex items-center justify-between">
            <div>
                <h3 className="flex items-center gap-2 text-lg text-red-500">
                    <FiAlertTriangle />
                    <span>Votre adresse email n'est pas vérifiée</span>
                </h3>
            </div>
            {
                emailSent && !error &&
                <div className="px-3 py-2 bg-gray-300 rounded-md">
                    Renvoyer un email dans {counter} secondes        
                </div>
            }
            {
                !emailSent &&
                <ButtonWithLoader loaderOrientation={'left'} type={'button'} variant={'primary'} saving={loading} error={error} onClick={handleSendVerificationEmail}>
                    <FiCheck/>
                    <span>Vérifier mon adresse email</span>
                </ButtonWithLoader>
            }
        </div>
    )
}