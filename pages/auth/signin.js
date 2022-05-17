import { Field, Form, Formik } from 'formik'
import { FiAlertCircle, FiLogIn } from "react-icons/fi"
import { signIn } from 'next-auth/react'
import * as Yup from 'yup'
import { useRouter } from 'next/router'
import Button from '../../components/ui/Button'
import { useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

export default function SigninPage() {

    const router = useRouter()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const SigninFormSchema = Yup.object().shape({
        email: Yup.string().email('Email invalide').required('Champs requis'),
        password: Yup.string().min(8, 'Au moins 8 caractères').required('Champs requis')
    })

    const handleSigninFormSubmit = async (values) => {
        setLoading(true)
        setError(null)
        const { email, password } = values
        
        const result = await signIn('credentials', {
            redirect: false,
            email,
            password
        })

        if (result.error) {
            setLoading(false)
            setError('Identifiant ou mot de passe incorrects')
            return
        }
        setLoading(false)
        router.replace('/dashboard')
    }


    return(
        <div className='flex justify-center items-center h-full'>
            {
                loading &&
                <div className="absolute inset-0 z-50 bg-gray-50/30 flex items-center justify-center">
                    <AiOutlineLoading3Quarters className={`text-6xl text-indigo-500 ${loading && 'animate-spin'}`} />
                </div>
            }
            <div className="w-11/12 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white drop-shadow rounded-md p-6 relative">
                <h1 className='text-indigo-500 text-center text-3xl mb-3'>Next-Base</h1>
                <h2 className='text-gray-500 text-center text-2xl mb-5'>Connexion</h2>
                <Formik
                    initialValues={{
                        email: '',
                        password: ''
                    }}
                    validationSchema={SigninFormSchema}
                    onSubmit={handleSigninFormSubmit}
                >
                    {({errors, touched}) => (
                        <Form>
                            <div className="flex flex-col mb-3 text-sm relative">
                                <label htmlFor="signinEmailInput" className="text-gray-600 mb-1 ml-1">Adresse email <span className="text-rose-500">*</span></label>
                                <Field name='email' type="email" className="p-2 rounded-lg border-[0.5px] border-gray-200 bg-gray-50" id="signinEmailInput" placeholder="example@example.com" />
                                {touched.email && errors.email && <span className='ml-2 flex items-center text-rose-500 absolute bottom-2 right-2'><span className='mr-1'>{errors.email}</span><FiAlertCircle /></span>}
                            </div>
                            <div className="flex flex-col mb-5 text-sm relative">
                                <label htmlFor="signinPasswordInput" className="text-gray-600 mb-1 ml-1">Mot de passe <span className="text-rose-500">*</span></label>
                                <Field name="password" type="password" className="p-2 rounded-lg border-[0.5px] border-gray-200 bg-gray-50" id="signinPasswordInput" placeholder="********" />
                                {touched.password && errors.password && <span className='ml-2 flex items-center text-rose-500 absolute bottom-2 right-2'><span className='mr-1'>{errors.password}</span><FiAlertCircle /></span>}
                            </div>
                            <div className="flex flex-col justify-center items-center text-sm">
                                {error && <p className='text-sm text-red-500 mb-5'>{error}</p>}
                                <Button variant={'primary-gradient'} type='submit'>
                                    <FiLogIn />
                                    <span>Connexion</span>
                                </Button>
                                <Button variant={'link'} href='/auth/signup'>
                                    Pas de compte ? S'inscrire ici
                                </Button>
                                <Button variant={'link'} href='/auth/forgot-password'>
                                    Mot de passe oublié ?
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}