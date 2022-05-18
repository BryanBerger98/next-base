import { useCallback, useState } from "react"
import { Formik, Form, Field, FastField } from "formik"
import * as Yup from 'yup'
import { FiAlertCircle, FiSave } from "react-icons/fi"
import DebouncedField from "../ui/DebouncedField"
import { useRouter } from "next/router"
import ButtonWithLoader from "../ui/ButtonWithLoader"
import { createUser, updateUser } from '../../packages/api/users'

export default function EditUserForm({user, setUser}) {

    const router = useRouter()

    const [saving, setSaving] = useState(false)
    const [errorCode, setErrorCode] = useState(null)

    const UserFormSchema = Yup.object().shape({
        username: Yup.string(),
        email: Yup.string().email('Email invalide').required('Champs requis'),
        phone_number: Yup.string(),
        role: Yup.string()
    })

    const handleSubmit = useCallback(async (values) => {
        setSaving(true)
        setErrorCode(null)
        try {
            if (user) {
                await updateUser({...user, ...values})
            } else {
                const response = await createUser({...values})
                router.push(`edit/${response._id}`)
            }
            setSaving(false)
        } catch (error) {
            setSaving(false)
            if (error.response && error.response.data && error.response.data.code) {
                setErrorCode(error.response.data.code)
                return
            }
            console.error(error)
        }
    }, [user, setUser, setSaving])

  return (
    <Formik
            initialValues={{
                username: user && user.username ? user.username : '',
                email: user && user.email ? user.email : '',
                phone_number: user && user.phone_number ? user.phone_number : '',
                role: user && user.role ? user.role : 'user'
            }}
            validationSchema={UserFormSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
            validateOnChange={false}
            validateOnBlur={false}
            validateOnMount={false}
        >
            {({errors, touched, handleChange, values}) => (
                <Form className="text-sm">
                    <div className="flex flex-col mb-3 text-sm relative">
                        <label htmlFor="userNameInput" className="text-slate-600 mb-1 ml-1">{'Nom d\'utilisateur'}</label>
                        <FastField name='username' >
                            {({ field }) => (
                                <DebouncedField type="text" value={values.username} onChange={handleChange} {...field} className="p-2 rounded-lg border-[0.5px] border-slate-200 bg-slate-50" id="userNameInput" placeholder="Nom d'utilisateur" />
                            )}
                        </FastField>
                        {touched.username && errors.username && <span className='ml-2 flex items-center text-rose-500 absolute bottom-2 right-2'><span className='mr-1'>{errors.username}</span><FiAlertCircle /></span>}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <div className="grow flex flex-col mb-3 text-sm relative">
                            <label htmlFor="userEmailInput" className="text-slate-600 mb-1 ml-1">Adresse email <span className="text-rose-500">*</span></label>
                            <FastField name='email' >
                                {({ field }) => (
                                    <DebouncedField type="email" value={values.email} onChange={handleChange} className="p-2 rounded-lg border-[0.5px] border-slate-200 bg-slate-50" id="userEmailInput" placeholder="example@example.com" {...field} />
                                )}
                            </FastField>
                            {touched.email && errors.email && <span className='ml-2 flex items-center text-rose-500 absolute bottom-2 right-2'><span className='mr-1'>{errors.email}</span><FiAlertCircle /></span>}
                        </div>
                        <div className="grow flex flex-col mb-3 text-sm relative">
                            <label htmlFor="userPhoneNumberInput" className="text-slate-600 mb-1 ml-1">Téléphone</label>
                            <FastField name='phone_number' >
                                {({ field }) => (
                                    <DebouncedField type="tel" value={values.phone_number} onChange={handleChange} className="p-2 rounded-lg border-[0.5px] border-slate-200 bg-slate-50" id="userEmailInput" placeholder="+33 6 01 02 03 04" {...field} />
                                )}
                            </FastField>
                            {touched.phone_number && errors.phone_number && <span className='ml-2 flex items-center text-rose-500 absolute bottom-2 right-2'><span className='mr-1'>{errors.phone_number}</span><FiAlertCircle /></span>}
                        </div>
                    </div>
                    <div className="flex flex-col mb-5 text-sm relative">
                        <label htmlFor="userRoleSelect" className="text-slate-600 mb-1 ml-1">Rôle <span className="text-rose-500">*</span></label>
                        <FastField name="role">
                            {({field}) => (
                                <Field as="select" id='userRoleSelect' className="appearance-none p-2 rounded-lg border-[0.5px] border-slate-200 bg-slate-50" {...field}>
                                    <option value="admin">Administrateur</option>
                                    <option value="user">Utilisateur</option>
                                </Field>
                            )}
                        </FastField>
                    </div>
                    <ButtonWithLoader variant={'success'} type='submit' saving={saving} loaderOrientation={'right'} error={errorCode} displayErrorMessage={true}>
                        <FiSave />
                        <span>Enregistrer</span>
                    </ButtonWithLoader>
                </Form>
            )}
        </Formik>
  )
}