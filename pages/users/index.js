import { FiPlus, FiUsers } from "react-icons/fi"
import { useState } from "react"
import UsersTable from "../../components/users/UsersTable"
import SearchInput from "../../components/ui/SearchInput"
import Button from "../../components/ui/Button"
import { getSession } from "next-auth/react"

export default function UsersPage() {

    const [searchString, setSearchString] = useState('')

    const onSearchUsers = (value) => {
        setSearchString(value)
    }

    return(
        <div className="container mx-auto my-10 text-gray-800">
            <h1 className="flex items-center gap-2 text-xl mb-5"><FiUsers /><span>Utilisateurs</span></h1>
            <div className="w-full min-h-96 bg-white drop-shadow rounded-md p-3 text-sm">
                <div className="grid grid-cols-12 mb-5">
                    <div className="col-span-6">
                        <SearchInput onSearchElements={onSearchUsers} />
                    </div>
                    <div className="col-span-6 flex justify-end">
                        <Button href={'/users/edit'} variant={'primary'}>
                            <FiPlus />
                            <span>Nouveau</span>
                        </Button>
                    </div>
                </div>
                <UsersTable searchString={searchString} />
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