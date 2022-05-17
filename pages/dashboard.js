import { getSession } from "next-auth/react";
import { FiHome } from "react-icons/fi";

export default function DashboardPage() {
    return(
        <div className="container mx-auto my-10 text-gray-800 px-5">
            <h1 className="flex items-center gap-2 text-xl mb-5"><FiHome /><span>Tableau de bord</span></h1>
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