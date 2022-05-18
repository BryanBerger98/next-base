import { useRouter } from "next/router"
import * as Yup from 'yup'
import { Formik, Form, Field } from "formik"
import { FiAlertCircle, FiCheckCircle, FiLogIn, FiSave } from "react-icons/fi"
import { useState } from 'react'
import Button from "../../../components/ui/Button"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import useTranslate from "../../../packages/hooks/translate"
import { resetPassword } from "../../../packages/api/auth"

export default function ResetPasswordPage() {

    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)

    const { getTranslatedError } = useTranslate({locale: 'fr'})

    const { token } = router.query

    const ResetPasswordFormSchema = Yup.object().shape({
        password: Yup.string().min(8, 'Au moins 8 caractères').required('Champs requis'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Doit être identique au mot de passe').required('Champs requis'),
    })

    const handleResetPasswordFormSubmit = (values) => {
        const { password } = values
        setLoading(true)

       resetPassword(token, password).then(response => {
            setSuccess(true)
            setTimeout(() => {
                router.replace('/auth/signin')
            }, 3000)
        }).catch(error => {
            if (err.response && err.response.data) {
                const errorMessage = getTranslatedError(err.response.data.code)
                return setError(errorMessage)
            }
            console.error(error)
        }).finally(() => {
            setLoading(false)
        })
    }
    return(
        <div className='flex justify-center items-center h-screen'>
             {
                loading &&
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                    <AiOutlineLoading3Quarters className={`text-6xl text-indigo-500 dark:text-indigo-300 ${loading && 'animate-spin'}`} />
                </div>
            }
            {
                !success &&
                <div className="w-11/12 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white dark:bg-gray-900 dark:text-gray-200 drop-shadow rounded-md p-6">
                    <h1 className='text-indigo-500 dark:text-indigo-300 text-center text-3xl mb-3'>Next-Base</h1>
                    <h2 className='text-gray-500 dark:text-gray-400 text-center text-2xl mb-5'>Nouveau mot de passe</h2>
                    <Formik
                        initialValues={{
                            password: '',
                            confirmPassword: ''
                        }}
                        validationSchema={ResetPasswordFormSchema}
                        onSubmit={handleResetPasswordFormSubmit}
                    >
                        {({errors, touched}) => (
                            <Form>
                                <div className="flex flex-col mb-5 text-sm relative">
                                    <label htmlFor="resetPasswordInput" className="mb-1 ml-1">Mot de passe <span className="text-rose-500">*</span></label>
                                    <Field name="password" type="password" className="p-2 rounded-md bg-gray-50 dark:bg-gray-700 shadow-inner" id="resetPasswordInput" placeholder="********" />
                                    {touched.password && errors.password && <span className='ml-2 flex items-center text-rose-500 absolute bottom-2 right-2'><span className='mr-1'>{errors.password}</span><FiAlertCircle /></span>}
                                </div>
                                <div className="flex flex-col mb-5 text-sm relative">
                                    <label htmlFor="resetConfirmPasswordInput" className="mb-1 ml-1">Confirmez le mot de passe <span className="text-rose-500">*</span></label>
                                    <Field name="confirmPassword" type="password" className="p-2 rounded-md bg-gray-50 dark:bg-gray-700 shadow-inner" id="resetConfirmPasswordInput" placeholder="********" />
                                    {touched.confirmPassword && errors.confirmPassword && <span className='ml-2 flex items-center text-rose-500 absolute bottom-2 right-2'><span className='mr-1'>{errors.confirmPassword}</span><FiAlertCircle /></span>}
                                </div>
                                <div className="flex flex-col justify-center items-center text-sm">
                                    {error && <p className='text-sm text-red-500 mb-5'>{error}</p>}
                                    <Button variant={'primary-gradient'} type='submit'>
                                        <FiSave />
                                        <span>Enregistrer</span>
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            }
            {
                success &&
                <div className="w-11/12 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white dark:bg-gray-900 dark:text-gray-200 drop-shadow rounded-md p-6">
                    <h1 className='text-indigo-500 dark:text-indigo-300 text-center text-3xl mb-3'>Next-Base</h1>
                    <h2 className='text-gray-500 dark:text-gray-400 text-center text-2xl mb-5'>Nouveau mot de passe</h2>
                    <div className="flex items-center justify-center text-green-500 text-6xl mb-5">
                        <FiCheckCircle />
                    </div>
                    <div className="flex flex-col justify-center items-center text-sm">
                        <p className="mb-3">Vous allez être redirigé dans quelques secondes</p>
                        <Button variant={'primary'} href={'/auth/signin'}>
                            <span>Se connecter</span>
                            <FiLogIn />
                        </Button>
                    </div>
                </div>
            }
        </div>
    )
}