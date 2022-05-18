import { FiAlertCircle, FiEdit, FiSave, FiUser } from "react-icons/fi";
import Button from "../ui/Button"
import { useState } from 'react'
import * as Yup from 'yup'
import Modal from "../ui/Modal";
import { Field, Form, Formik } from "formik";
import { useAuthContext } from "../../store/authContext";
import AccountProfilePhotoInput from "./AccountProfilePhotoInput";
import useTranslate from "../../packages/hooks/translate";
import { updateAccount } from "../../packages/api/auth";
import { useThemeContext } from "../../store/themeContext";

export default function AccountInformationsSection({ currentUser }) {

    const { dispatchCurrentUser } = useAuthContext()
    const { theme } = useThemeContext()
    const { getTranslatedRole } = useTranslate({locale: 'fr'})

    const [isEditAccountInfosModalOpen, setIsEditAccountInfosModalOpen] = useState(false)

    const AccountInfosFormSchema = Yup.object().shape({
        username: Yup.string().required('Champs requis')
    })

    const handleAccountInfosFormSubmit = async (values) => {
        const { username } = values
        try {

            setIsEditAccountInfosModalOpen(false)
            await updateAccount({username})
            dispatchCurrentUser({...currentUser, username})
        } catch (error) {
            throw error
        }
    }

    return(
        <>
            <div className="bg-indigo-500 dark:bg-indigo-300 rounded-md p-6 text-gray-50 dark:text-gray-800 mb-4 flex gap-4">
               <AccountProfilePhotoInput currentUser={currentUser} />
                <div className="my-auto">
                    <h2 className="text-2xl">{currentUser && currentUser.username ? currentUser.username : <span className="italic">Sans nom</span>}</h2>
                    <p className="text-indigo-200 dark:text-gray-700">{currentUser && getTranslatedRole(currentUser.role)}</p>
                </div>
                <div className="ml-auto mb-auto text-sm">
                    <Button variant={theme === 'dark' ? 'dark' : 'light'} onClick={() => setIsEditAccountInfosModalOpen(true)}>
                        <FiEdit />
                        <span>Modifier</span>
                    </Button>
                </div>
            </div>
            <Modal isOpen={isEditAccountInfosModalOpen} closeModal={() => setIsEditAccountInfosModalOpen(false)} title={{text: <span className='flex items-center gap-2'><FiUser /><span>Profil</span></span>, color: 'text-indigo-500 dark:text-indigo-300'}}>
                <div className="my-5">
                    <Formik
                        initialValues={{
                            username: currentUser && currentUser.username ? currentUser.username : ''
                        }}
                        validationSchema={AccountInfosFormSchema}
                        onSubmit={handleAccountInfosFormSubmit}
                    >
                        {({errors, touched}) => (
                            <Form>
                                <div className="flex flex-col mb-3 text-sm relative">
                                    <label htmlFor="accountUsernameInput" className="mb-1 dark:text-gray-200">Nom d'utilisateur</label>
                                    <Field type="text" name="username" id="accountUsernameInput" placeholder="Ex: John DOE" className="bg-gray-100 placeholder:text-gray-400 dark:bg-gray-700 dark:text-gray-50 shadow-inner p-2 rounded-md" />
                                    {touched.username && errors.username && <span className='ml-2 flex items-center text-rose-500 absolute bottom-2 right-2'><span className='mr-1'>{errors.username}</span><FiAlertCircle /></span>}
                                </div>
                                <div className="mt-4 flex text-sm justify-end">
                                    <Button variant={'success'} type='submit'>
                                        <FiSave />
                                        <span>Enregistrer</span>
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Modal>
        </>
    )
}