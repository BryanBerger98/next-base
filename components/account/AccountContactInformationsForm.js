import { Formik, Field, Form } from "formik";
import * as Yup from 'yup'
import { useState, Fragment } from 'react'
import { useAuthContext } from "../../store/authContext";
import { FiAlertCircle, FiAtSign, FiSave } from "react-icons/fi";
import PasswordFormModal from "./PasswordFormModal";
import ButtonWithLoader from "../ui/ButtonWithLoader";
import { updateAccount, updateEmail } from "../../packages/api/auth";
import Button from "../ui/Button";

async function updateUser({email, password, phone_number}) {
    try {
        if (email && password) {
            await updateEmail(email, password)
        }
    
        if (phone_number) {
            await updateAccount({phone_number})
        }
    
        return
    } catch (error) {
        throw error
    }
}

export default function AccountContactInformationsForm({ currentUser }) {

    const { dispatchCurrentUser } = useAuthContext()

    const [isPasswordFormModalOpen, setIsPasswordFormModalOpen] = useState(false)
    const [passwordError, setPasswordError] = useState(null)
    const [saving, setSaving] = useState(false)
    const [formValues, setFormValues] = useState({})


    const ContactInfosFormSchema = Yup.object().shape({
        phoneNumber: Yup.string(),
        email: Yup.string().email('Email invalide').required('Champs requis')
    })

    const handleContactInfosFormSubmit = async (values) => {
        const { phoneNumber, email } = values
        setFormValues({phoneNumber, email})

        if (currentUser.email.toLowerCase().trim() !== email.toLowerCase().trim()) {
            setIsPasswordFormModalOpen(true)
            return
        }

        setSaving(true)

        try {
            await updateUser({phone_number: phoneNumber})
            currentUser.phone_number = phoneNumber
            dispatchCurrentUser(currentUser)
            setSaving(false)
        } catch (error) {
            setSaving(false)
            console.error(error)
        }
    }

    const handlePasswordFormSubmit = async (password) => {
        setSaving(true)
        setPasswordError(null)
        const updateObject = {
            email: formValues.email && formValues.email.length > 0 ? formValues.email : null,
            phone_number: formValues.phoneNumber && formValues.phoneNumber.length > 0 ? formValues.phoneNumber : null
        }

        try {
            await updateUser({
                ...updateObject,
                password: password && password.length >= 8 ? password : null,
            })
    
            if (updateObject.email) {
                currentUser.email = updateObject.email
            }
    
            if (updateObject.phone_number) {
                currentUser.phone_number = updateObject.phone_number
            }
    
            dispatchCurrentUser(currentUser)
            setIsPasswordFormModalOpen(false)
            setSaving(false)
        } catch (error) {
            setSaving(false)
            if (error.response && error.response.data && error.response.data.code && error.response.data.code === 'auth/wrong-password') {
                setPasswordError(error.response.data.code)
                return
            }
            console.error(error)
        }
    }

    return(
        <Fragment>
            <Formik
                initialValues={{
                    phoneNumber: currentUser && currentUser.phone_number ? currentUser.phone_number : '',
                    email: currentUser ? currentUser.email : ''
                }}
                validationSchema={ContactInfosFormSchema}
                onSubmit={handleContactInfosFormSubmit}
                enableReinitialize={true}
            >
                {({errors, touched}) => (
                    <Form className="flex flex-col h-full">
                        <h3 className="flex items-center gap-2 text-lg mb-5">
                            <FiAtSign />
                            <span>Contact</span>
                        </h3>
                        <div className="flex flex-col mb-3 relative">
                            <label htmlFor="accountContactPhoneNumberInput" className="mb-1">Téléphone</label>
                            <Field type="tel" name='phoneNumber' id="accountContactPhoneNumberInput" placeholder="Ex: +33 6 01 02 03 04" className="bg-gray-100 placeholder:text-gray-400 dark:bg-gray-700 dark:text-gray-50 p-2 rounded-md shadow-inner" />
                            {touched.phoneNumber && errors.phoneNumber && <span className='ml-2 flex items-center text-rose-500 absolute bottom-2 right-2'><span className='mr-1'>{errors.phoneNumber}</span><FiAlertCircle /></span>}
                        </div>
                        <div className="flex flex-col text-sm mb-5 relative">
                            <label htmlFor="accountContactEmailInput" className="mb-1">Adresse email</label>
                            <Field type="email" name='email' id="accountContactEmailInput" placeholder="example@example.com" className="bg-gray-100 placeholder:text-gray-400 dark:bg-gray-700 dark:text-gray-50 p-2 rounded-md shadow-inner" />
                            {touched.email && errors.email && <span className='ml-2 flex items-center text-rose-500 absolute bottom-2 right-2'><span className='mr-1'>{errors.email}</span><FiAlertCircle /></span>}
                        </div>
                        <div className="mt-auto mr-auto">
                            <ButtonWithLoader variant={'success'} type='submit' saving={saving}>
                                <FiSave />
                                <span>Enregistrer</span>
                            </ButtonWithLoader>
                        </div>
                    </Form>
                )}
            </Formik>
            <PasswordFormModal isOpen={isPasswordFormModalOpen} setIsOpen={setIsPasswordFormModalOpen} submitFunction={handlePasswordFormSubmit} error={passwordError} />
        </Fragment>
    )
}