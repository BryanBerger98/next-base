import { Field, Form, Formik } from 'formik'
import { FiAlertCircle, FiSend } from "react-icons/fi"
import * as Yup from 'yup'
import Button from '../../components/ui/Button'
import { useState } from 'react'
import useTranslate from '../../packages/hooks/translate'
import { sendResetPasswordEmailToUserByEmail } from '../../packages/api/auth'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import ThemeToggleSwitch from '../../components/ui/ThemeToggleSwitch'

export default function ForgotPasswordPage() {

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const [counter, setCounter] = useState(60)

    const { getTranslatedError } = useTranslate({locale: 'fr'})

    const ForgotPasswordFormSchema = Yup.object().shape({
        email: Yup.string().email('Email invalide').required('Champs requis')
    })

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

    const handleForgotPasswordFormSubmit = async (values) => {
        const { email } = values
        setLoading(true)
        try {
            await sendResetPasswordEmailToUserByEmail(email)
            setLoading(false)
            setEmailSent(true)
            startCountDown(60)
        } catch (err) {
            setLoading(false)
            if (err.response && err.response.data && err.response.data.code) {
                const errorMessage = getTranslatedError(err.response.data.code)
                setError(errorMessage)
                return
            }
            console.error(error)
        }
    }


    return(
        <div className='flex justify-center items-center h-full'>
             {
                loading &&
                <div className="absolute inset-0 z-50 bg-gray-50/30 flex items-center justify-center">
                    <AiOutlineLoading3Quarters className={`text-6xl text-indigo-500 ${loading && 'animate-spin'}`} />
                </div>
            }
            <>
                <div className='absolute top-5 right-5'>
                    <ThemeToggleSwitch />
                </div>
                <div className="w-11/12 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white dark:bg-gray-900 dark:text-gray-200 drop-shadow rounded-md p-6">
                    <h1 className='text-indigo-500 dark:text-indigo-300 text-center text-3xl mb-3'>Next-Base</h1>
                    <h2 className='text-gray-500 dark:text-gray-400 text-center text-2xl mb-6'>Mot de passe oubli??</h2>
                    <Formik
                        initialValues={{
                            email: ''
                        }}
                        validationSchema={ForgotPasswordFormSchema}
                        onSubmit={handleForgotPasswordFormSubmit}
                    >
                        {({errors, touched}) => (
                            <Form>
                                <div className="flex flex-col mb-5 text-sm relative">
                                    <label htmlFor="forgotPasswordEmailInput" className="mb-1 ml-1">Adresse email <span className="text-rose-500">*</span></label>
                                    <Field name='email' type="email" className="p-2 rounded-md bg-gray-50 dark:bg-gray-700 shadow-inner" id="forgotPasswordEmailInput" placeholder="example@example.com" />
                                    {touched.email && errors.email && <span className='ml-2 flex items-center text-rose-500 absolute bottom-2 right-2'><span className='mr-1'>{errors.email}</span><FiAlertCircle /></span>}
                                </div>
                                <div className="flex flex-col justify-center items-center text-sm">
                                    {error && <p className='text-sm text-red-500 mb-5'>{error}</p>}
                                    {   !emailSent &&
                                        <>
                                            <Button variant={'primary-gradient'} type='submit'>
                                                <FiSend />
                                                <span>Envoyer</span>
                                            </Button>
                                            <Button variant={'link'} href='/auth/sigin'>
                                                Retour
                                            </Button>
                                        </>
                                    }
                                    {
                                        emailSent &&
                                        <>
                                        <p className='mb-3 text-green-500'>Email envoy?? !</p>
                                            <div className="px-3 py-2 bg-gray-300 rounded-md">
                                                Renvoyer un email dans {counter} secondes        
                                            </div>
                                        </>
                                    }
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </>
        </div>
    )
}