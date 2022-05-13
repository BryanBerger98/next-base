import { SessionProvider } from 'next-auth/react'
import Layout from '../components/layout/Layout'
import AuthContextProvider from '../store/authContext'
import UsersContextProvider from '../store/usersContext'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider>
      <AuthContextProvider>
        <UsersContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UsersContextProvider>
      </AuthContextProvider>
    </SessionProvider>
  )
}

export default MyApp
