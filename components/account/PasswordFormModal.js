import Modal from "../ui/Modal";
import { Formik, Field, Form } from "formik";
import * as Yup from 'yup'
import { FiAlertCircle, FiLock, FiUnlock } from "react-icons/fi";
import { useState } from 'react'
import Button from "../ui/Button";

export default function PasswordFormModal({isOpen, setIsOpen, submitFunction, error}) {

    const [formValues, setFormValues] = useState({
        password: ''
    })

    const PasswordForm = Yup.object().shape({
        password: Yup.string().min(8, 'Au moins 8 caractères').required('Champs requis')
    })

    const handlePasswordFormSubmit = async (values) => {
        const { password } = values
        submitFunction(password)
        setFormValues({
            password: ''
        })
    }

    return(
        <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)} title={{text: <span className='flex items-center gap-2'><FiLock /><span>Mot de passe</span></span>, color: 'text-indigo-500'}}>
            <div className="my-5">
                <Formik
                    initialValues={formValues}
                    validationSchema={PasswordForm}
                    onSubmit={handlePasswordFormSubmit}
                    enableReinitialize={true}
                >
                    {({errors, touched}) => (
                        <Form>
                            <div className="flex flex-col mb-3 text-sm relative">
                                <label htmlFor="accountUsernameInput" className="mb-1 dark:text-gray-200">Mot de passe</label>
                                <Field type="password" name="password" id="accountUsernameInput" placeholder="Ex: John DOE" className="bg-gray-100 placeholder:text-gray-400 dark:text-gray-50 dark:bg-gray-700 shadow-inner p-2 rounded-md" />
                                {touched.password && errors.password && <span className='ml-2 flex items-center text-rose-500 absolute bottom-2 right-2'><span className='mr-1'>{errors.password}</span><FiAlertCircle /></span>}
                            </div>
                            <div className="mt-4 flex flex-row text-sm justify-end items-center gap-2">
                                {error && error === 'auth/wrong-password' && <span className='flex items-center text-rose-500'><span className='mr-1'>Mot de passe incorrect</span><FiAlertCircle /></span>}
                                <Button variant={'success'} type='submit'>
                                    <FiUnlock />
                                    <span>Valider</span>
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    )
}