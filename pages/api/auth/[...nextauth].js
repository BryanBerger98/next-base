import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyPassword } from '../../../utils/password'
import { connectToDatabase } from '../../../utils/mongodb'
import User from '../../../models/User.model'

export default NextAuth({
    session: {
        jwt: true
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
                
                return {
                    email: user.email,
                    role: user.role ? user.role : null,
                    _id: user._id
                }
            }
        })
    ]
})