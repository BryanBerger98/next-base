import { Field, Form, Formik } from 'formik'
import { FiAlertCircle } from "react-icons/fi"
import * as Yup from 'yup'
import axios from 'axios'
import Link from 'next/link'

export default function SignupPage() {

    const SignupFormSchema = Yup.object().shape({
        email: Yup.string().email('Email invalide').required('Champs requis'),
        password: Yup.string().min(8, 'Au moins 8 caractères').required('Champs requis'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Doit être identique au mot de passe').required('Champs requis'),
        termsCheck: Yup.boolean().oneOf([true], 'Champs requis')
    })

    const handleSignupFormSubmit = async (values) => {
        const { email, password } = values

        axios.post(`/api/auth/signup`, {email, password}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            console.log(response)
        }).catch(error => {
            if (error.response.data.code === 'auth/email-already-in-use') {
                return alert('Cette adresse email est déjà attribuée.')
            }
            console.error(error.response.data)
        })
    }

    return(
        <div className='flex justify-center items-center h-screen bg-gray-50'>
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
                            <div className="flex flex-col mb-5 text-sm relative">
                                <label htmlFor="signupPasswordInput" className="text-gray-600 mb-1 ml-1">Mot de passe <span className="text-rose-500">*</span></label>
                                <Field name="password" type="password" className="p-2 rounded-lg border-[0.5px] border-gray-200 bg-gray-50" id="signupPasswordInput" placeholder="********" />
                                {touched.password && errors.password && <span className='ml-2 flex items-center text-rose-500 absolute bottom-2 right-2'><span className='mr-1'>{errors.password}</span><FiAlertCircle /></span>}
                            </div>
                            <div className="flex flex-col mb-5 text-sm relative">
                                <label htmlFor="signupConfirmPasswordInput" className="text-gray-600 mb-1 ml-1">Confirmez le mot de passe <span className="text-rose-500">*</span></label>
                                <Field name="confirmPassword" type="password" className="p-2 rounded-lg border-[0.5px] border-gray-200 bg-gray-50" id="signupConfirmPasswordInput" placeholder="********" />
                                {touched.confirmPassword && errors.confirmPassword && <span className='ml-2 flex items-center text-rose-500 absolute bottom-2 right-2'><span className='mr-1'>{errors.confirmPassword}</span><FiAlertCircle /></span>}
                            </div>
                            <div className="flex flex-col justify-center align-center">
                                <button className="px-4 py-2 mb-5 mx-auto bg-gradient-to-r from-indigo-700 to-indigo-500 text-gray-50 rounded-md" type="submit">
                                    Inscription
                                </button>
                                <Link href={'/auth/signin'}>
                                    <a className='text-sm mx-auto text-gray-500 hover:underline'>
                                        Déjà un compte ? Se connecter
                                    </a>
                                </Link>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}