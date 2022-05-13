import axios from 'axios'
import { Field, Form, Formik } from 'formik'
import { FiAlertCircle } from "react-icons/fi"
import * as Yup from 'yup'

export default function ForgotPasswordPage() {

    const ForgotPasswordFormSchema = Yup.object().shape({
        email: Yup.string().email('Email invalide').required('Champs requis')
    })

    const handleForgotPasswordFormSubmit = async (values) => {
        const { email } = values
        
        try {
            const response = await axios.post(`/api/auth/reset-password`, {email}, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            console.log(response.data)
            return response.data
        } catch (error) {
            throw error
        }
    }


    return(
        <div className='flex justify-center items-center h-full'>
            <div className="w-11/12 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white drop-shadow rounded-md p-6">
                <h1 className='text-indigo-500 text-center text-3xl mb-3'>Next-Base</h1>
                <h2 className='text-gray-500 text-center text-2xl mb-5'>Mot de passe oublié</h2>
                <Formik
                    initialValues={{
                        email: ''
                    }}
                    validationSchema={ForgotPasswordFormSchema}
                    onSubmit={handleForgotPasswordFormSubmit}
                >
                    {({errors, touched}) => (
                        <Form>
                            <div className="flex flex-col mb-3 text-sm relative">
                                <label htmlFor="forgotPasswordEmailInput" className="text-gray-600 mb-1 ml-1">Adresse email <span className="text-rose-500">*</span></label>
                                <Field name='email' type="email" className="p-2 rounded-lg border-[0.5px] border-gray-200 bg-gray-50" id="forgotPasswordEmailInput" placeholder="example@example.com" />
                                {touched.email && errors.email && <span className='ml-2 flex items-center text-rose-500 absolute bottom-2 right-2'><span className='mr-1'>{errors.email}</span><FiAlertCircle /></span>}
                            </div>
                            <div className="flex flex-col justify-center align-center">
                                <button className="px-4 py-2 mb-5 mx-auto bg-gradient-to-r from-indigo-700 to-indigo-500 text-gray-50 rounded-md" type="submit">
                                    Envoyer
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}