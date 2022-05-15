import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyPassword } from '../../../utils/password'
import { connectToDatabase } from '../../../utils/mongodb'
import User from '../../../models/User.model'

export default NextAuth({
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                await connectToDatabase()

                const user = await User.findOne({email: credentials.email})

                if (!user) {
                    throw new Error('No user registered!')
                }

                const isPasswordValid = await verifyPassword(credentials.password, user.password)
                
                if (!isPasswordValid) {
                    throw new Error('Wrong password.')
                }

                const payload = {
                    _id: user._id,
                    role: user.role ? user.role : null,
                    email: user.email,
                    name: user.username ? user.username : 'No name',
                }
                
                return payload
                
            }
        })
    ],
    callbacks: {
        session: async ({ session, token }) => {
            if (session?.user) {
              session.user._id = token.uid;
            }
            return session;
        },
        jwt: async ({ user, token }) => {
            if (user) {
              token.uid = user._id;
              token.role = user.role
            }
            return token;
        },
    }
})