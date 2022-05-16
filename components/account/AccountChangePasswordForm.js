import { useState } from 'react'
import { FiAlertCircle, FiLock, FiSave } from 'react-icons/fi'
import Button from '../ui/Button'
import { Formik, Field, Form } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'

export default function AccountChangePasswordForm() {

    const [formValues, setFormValues] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    })

    const ChangePasswordFormSchema = Yup.object().shape({
        oldPassword: Yup.string().required('Champs requis'),
        newPassword: Yup.string().notOneOf([Yup.ref('oldPassword')], 'Doit être différent de votre ancien mot de passe').min(8, 'Au moins 8 caractères').required('Champs requis'),
        confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Doit être identique au mot de passe').required('Champs requis'),
        termsCheck: Yup.boolean().oneOf([true], 'Champs requis')
    })

    const handleChangePasswordFormSubmit = async (values) => {
        const { newPassword, oldPassword } = values
        setFormValues(values)

        try {
            await axios.put('/api/auth/update-password', {newPassword, oldPassword}, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            })
        } catch (error) {
            console.error(error)
        }

        setFormValues({
            ...formValues,
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        })
    }

    return(
        <Formik
            initialValues={formValues}
            validationSchema={ChangePasswordFormSchema}
            onSubmit={handleChangePasswordFormSubmit}
            enableReinitialize={true}
        >
            {({errors, touched}) => (
                <Form>
                    <h3 className="flex items-center gap-2 text-lg mb-5">
                        <FiLock />
                        <span>Mot de passe</span>
                    </h3>
                    <div className="flex flex-col mb-3 relative">
                        <label htmlFor="oldPasswordChangePasswordInput" className="mb-1">Mot de passe actuel</label>
                        <Field type="password" name="oldPassword" id="oldPasswordChangePasswordInput" placeholder="********" className="bg-gray-100 placeholder:text-gray-400 p-2 rounded-md" />
                        {touched.oldPassword && errors.oldPassword && <span className='ml-2 flex items-center text-rose-500 absolute bottom-2 right-2'><span className='mr-1'>{errors.oldPassword}</span><FiAlertCircle /></span>}
                    </div>
                    <div className="flex flex-col text-sm mb-3 relative">
                        <label htmlFor="newPasswordChangePasswordInput" className="mb-1">Nouveau mot de passe</label>
                        <Field type="password" name="newPassword" id="newPasswordChangePasswordInput" placeholder="********" className="bg-gray-100 placeholder:text-gray-400 p-2 rounded-md" />
                        {touched.newPassword && errors.newPassword && <span className='ml-2 flex items-center text-rose-500 absolute bottom-2 right-2'><span className='mr-1'>{errors.newPassword}</span><FiAlertCircle /></span>}
                    </div>
                    <div className="flex flex-col text-sm mb-5 relative">
                        <label htmlFor="confirmNewPasswordChangePasswordInput" className="mb-1">Confirmer le mot de passe</label>
                        <Field type="password" name="confirmNewPassword" id="confirmNewPasswordChangePasswordInput" placeholder="********" className="bg-gray-100 placeholder:text-gray-400 p-2 rounded-md" />
                        {touched.confirmNewPassword && errors.confirmNewPassword && <span className='ml-2 flex items-center text-rose-500 absolute bottom-2 right-2'><span className='mr-1'>{errors.confirmNewPassword}</span><FiAlertCircle /></span>}
                    </div>
                    <div className="mt-auto mr-auto">
                        <Button variant={'success'} type='submit'>
                            <FiSave />
                            <span>Enregistrer</span>
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}