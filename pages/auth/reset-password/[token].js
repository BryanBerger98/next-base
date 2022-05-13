import { useRouter } from "next/router"
import * as Yup from 'yup'
import { Formik, Form, Field } from "formik"
import axios from "axios"
import { FiAlertCircle } from "react-icons/fi"

export default function ResetPasswordPage() {

    const router = useRouter()

    const { token } = router.query

    const ResetPasswordFormSchema = Yup.object().shape({
        password: Yup.string().min(8, 'Au moins 8 caractères').required('Champs requis'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Doit être identique au mot de passe').required('Champs requis'),
    })

    const handleResetPasswordFormSubmit = (values) => {
        const { password } = values

        console.log(values)

        axios.put(`/api/auth/reset-password`, {token, password}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            console.log(response)
            // Navigate to login
        }).catch(error => {
            console.error(error.response.data)
        })
    }
    return(
        <div className='flex justify-center items-center h-screen bg-gray-50'>
            <div className="w-11/12 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white drop-shadow rounded-md p-6">
                <h1 className='text-indigo-500 text-center text-3xl mb-3'>Next-Base</h1>
                <h2 className='text-gray-500 text-center text-2xl mb-5'>Nouveau mot de passe</h2>
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
                                <label htmlFor="resetPasswordInput" className="text-gray-600 mb-1 ml-1">Mot de passe <span className="text-rose-500">*</span></label>
                                <Field name="password" type="password" className="p-2 rounded-lg border-[0.5px] border-gray-200 bg-gray-50" id="resetPasswordInput" placeholder="********" />
                                {touched.password && errors.password && <span className='ml-2 flex items-center text-rose-500 absolute bottom-2 right-2'><span className='mr-1'>{errors.password}</span><FiAlertCircle /></span>}
                            </div>
                            <div className="flex flex-col mb-5 text-sm relative">
                                <label htmlFor="resetConfirmPasswordInput" className="text-gray-600 mb-1 ml-1">Confirmez le mot de passe <span className="text-rose-500">*</span></label>
                                <Field name="confirmPassword" type="password" className="p-2 rounded-lg border-[0.5px] border-gray-200 bg-gray-50" id="resetConfirmPasswordInput" placeholder="********" />
                                {touched.confirmPassword && errors.confirmPassword && <span className='ml-2 flex items-center text-rose-500 absolute bottom-2 right-2'><span className='mr-1'>{errors.confirmPassword}</span><FiAlertCircle /></span>}
                            </div>
                            <div className="flex flex-col justify-center align-center">
                                <button className="px-4 py-2 mb-5 mx-auto bg-gradient-to-r from-indigo-700 to-indigo-500 text-gray-50 rounded-md" type="submit">
                                    Enregistrer
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}