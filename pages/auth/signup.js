import { Field, Form, Formik } from 'formik'
import { FiAlertCircle, FiUserPlus } from "react-icons/fi"
import * as Yup from 'yup'
import { useState } from 'react'
import Button from '../../components/ui/Button'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import useTranslate from '../../packages/hooks/translate'
import { signupUser } from '../../packages/api/auth'

export default function SignupPage() {

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    const { getTranslatedError } = useTranslate({locale: 'fr'})

    const SignupFormSchema = Yup.object().shape({
        email: Yup.string().email('Email invalide').required('Champs requis'),
        password: Yup.string().min(8, 'Au moins 8 caractères').required('Champs requis'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Doit être identique au mot de passe').required('Champs requis'),
        termsCheck: Yup.boolean().oneOf([true], 'Champs requis')
    })

    const handleSignupFormSubmit = async (values) => {
        const { email, password } = values
        setLoading(true)
        setError(null)
        try {
            await signupUser(email, password)
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password
            })

            if (result.error) {
                setLoading(false)
                console.error(result.error)
                const errorMessage = getTranslatedError(result.error)
                setError(errorMessage)   
                return
            }

            setLoading(false)
            router.replace('/dashboard')
        } catch (err) {
            setLoading(false)
            console.error(err)
            if (err.response && err.response.data) {
                const errorMessage = getTranslatedError(err.response.data.code)
                setError(errorMessage)   
            }
        }
    }

    return(
        <div className='flex justify-center items-center h-screen bg-gray-50'>
            {
                loading &&
                <div className="absolute inset-0 z-50 bg-gray-50/30 flex items-center justify-center">
                    <AiOutlineLoading3Quarters className={`text-6xl text-indigo-500 ${loading && 'animate-spin'}`} />
                </div>
            }
            <div className="w-11/12 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white drop-shadow rounded-md p-6">
                <h1 className='text-indigo-500 text-center text-3xl mb-3'>Next-Base</h1>
                <h2 className='text-gray-500 text-center text-2xl mb-5'>Inscription</h2>
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                        confirmPassword: ''
                    }}
                    validationSchema={SignupFormSchema}
                    onSubmit={handleSignupFormSubmit}
                >
                    {({errors, touched}) => (
                        <Form>
                            <div className="flex flex-col mb-3 text-sm relative">
                                <label htmlFor="signupEmailInput" className="text-gray-600 mb-1 ml-1">Adresse email <span className="text-rose-500">*</span></label>
                                <Field name='email' type="email" className="p-2 rounded-lg border-[0.5px] border-gray-200 bg-gray-50" id="signupEmailInput" placeholder="example@example.com" />
                                {touched.email && errors.email && <span className='ml-2 flex items-center text-rose-500 absolute bottom-2 right-2'><span className='mr-1'>{errors.email}</span><FiAlertCircle /></span>}
                            </div>
                            <div className="flex flex-col mb-3 text-sm relative">
                                <label htmlFor="signupPasswordInput" className="text-gray-600 mb-1 ml-1">Mot de passe <span className="text-rose-500">*</span></label>
                                <Field name="password" type="password" className="p-2 rounded-lg border-[0.5px] border-gray-200 bg-gray-50" id="signupPasswordInput" placeholder="********" />
                                {touched.password && errors.password && <span className='ml-2 flex items-center text-rose-500 absolute bottom-2 right-2'><span className='mr-1'>{errors.password}</span><FiAlertCircle /></span>}
                            </div>
                            <div className="flex flex-col mb-5 text-sm relative">
                                <label htmlFor="signupConfirmPasswordInput" className="text-gray-600 mb-1 ml-1">Confirmez le mot de passe <span className="text-rose-500">*</span></label>
                                <Field name="confirmPassword" type="password" className="p-2 rounded-lg border-[0.5px] border-gray-200 bg-gray-50" id="signupConfirmPasswordInput" placeholder="********" />
                                {touched.confirmPassword && errors.confirmPassword && <span className='ml-2 flex items-center text-rose-500 absolute bottom-2 right-2'><span className='mr-1'>{errors.confirmPassword}</span><FiAlertCircle /></span>}
                            </div>
                             <div className="flex flex-col justify-center items-center text-sm">
                                {error && <p className='text-sm text-red-500 mb-5'>{error}</p>}
                                <Button variant={'primary-gradient'} type='submit'>
                                    <FiUserPlus />
                                    <span>Inscription</span>
                                </Button>
                                <Button variant={'link'} href='/auth/signin'>
                                    Déjà un compte ? Se connecter
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}