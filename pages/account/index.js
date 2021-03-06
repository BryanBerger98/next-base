import { getSession } from "next-auth/react"
import { FiAlertTriangle, FiAtSign, FiEdit, FiLock, FiSave, FiUser } from "react-icons/fi"
import AccountChangePasswordForm from "../../components/account/AccountChangePasswordForm"
import AccountContactInformationsForm from "../../components/account/AccountContactInformationsForm"
import AccountEmailVerification from "../../components/account/AccountEmailVerification"
import AccountInformationsSection from "../../components/account/AccountInformationsSection"
import Button from "../../components/ui/Button"
import { useAuthContext } from "../../store/authContext"

export default function AccountPage() {

    const { currentUser } = useAuthContext()

    return(
        <div className="container mx-auto lg:px-5 my-10 text-gray-800">
            <h1 className="flex items-center gap-2 text-xl mb-5"><FiUser /><span>Mon compte</span></h1>
            <AccountInformationsSection currentUser={currentUser} />
            { currentUser && !currentUser.email_verified && <AccountEmailVerification />  }
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-6">
                    <div className="h-full bg-white dark:bg-gray-900 dark:text-gray-200 rounded-md drop-shadow p-5 text-sm">
                        <AccountContactInformationsForm  currentUser={currentUser} />
                    </div>
                </div>
                <div className="col-span-12 lg:col-span-6">
                    <div className="h-full bg-white dark:bg-gray-900 dark:text-gray-200 rounded-md drop-shadow p-5 flex flex-col text-sm">
                        <AccountChangePasswordForm />
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