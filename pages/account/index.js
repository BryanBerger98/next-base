import { getSession } from "next-auth/react"
import { FiAtSign, FiEdit, FiLock, FiSave, FiUser } from "react-icons/fi"
import AccountInformationsSection from "../../components/account/AccountInformationsSection"
import Button from "../../components/ui/Button"
import { useAuthContext } from "../../store/authContext"

export default function AccountPage() {

    const { currentUser } = useAuthContext()

    return(
        <div className="container mx-auto px-5 my-10 text-gray-800">
            <h1 className="flex items-center gap-2 text-xl mb-5"><FiUser /><span>Mon compte</span></h1>
            <AccountInformationsSection currentUser={currentUser} />
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                    <div className="h-96 bg-white rounded-md drop-shadow p-5 flex flex-col text-sm">
                        <h3 className="flex items-center gap-2 text-lg mb-5">
                           <FiAtSign />
                           <span>Contact</span>
                        </h3>
                        <div className="flex flex-col mb-3">
                            <label htmlFor="accountContactPhoneNumberInput" className="mb-1">Téléphone</label>
                            <input type="tel" id="accountContactPhoneNumberInput" placeholder="Ex: +33 6 01 02 03 04" className="bg-gray-100 placeholder:text-gray-400 p-2 rounded-md" />
                        </div>
                        <div className="flex flex-col text-sm">
                            <label htmlFor="accountContactEmailInput" className="mb-1">Adresse email</label>
                            <input type="email" id="accountContactEmailInput" placeholder="example@example.com" className="bg-gray-100 placeholder:text-gray-400 p-2 rounded-md" />
                        </div>
                        <div className="mt-auto mr-auto">
                            <Button variant={'success'}>
                                <FiSave />
                                <span>Enregistrer</span>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="col-span-6">
                <div className="h-96 bg-white rounded-md drop-shadow p-5 flex flex-col text-sm">
                        <h3 className="flex items-center gap-2 text-lg mb-5">
                           <FiLock />
                           <span>Mot de passe</span>
                        </h3>
                        <div className="flex flex-col mb-3">
                            <label htmlFor="accountPasswordInput" className="mb-1">Mot de passe actuel</label>
                            <input type="password" id="accountPasswordInput" placeholder="********" className="bg-gray-100 placeholder:text-gray-400 p-2 rounded-md" />
                        </div>
                        <div className="flex flex-col text-sm mb-3">
                            <label htmlFor="accountNewPasswordInput" className="mb-1">Nouveau mot de passe</label>
                            <input type="password" id="accountNewPasswordInput" placeholder="********" className="bg-gray-100 placeholder:text-gray-400 p-2 rounded-md" />
                        </div>
                        <div className="flex flex-col text-sm">
                            <label htmlFor="accountNewPasswordConfirmInput" className="mb-1">Confirmer le mot de passe</label>
                            <input type="password" id="accountNewPasswordConfirmInput" placeholder="********" className="bg-gray-100 placeholder:text-gray-400 p-2 rounded-md" />
                        </div>
                        <div className="mt-auto mr-auto">
                            <Button variant={'success'}>
                                <FiSave />
                                <span>Enregistrer</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession({req: context.req})
  
    if (!session) {
      return {
        redirect: {
          destination : '/',
          permanent: false
        }
      }
    }
  
    return {
      props: {
        session
      }
    }
}