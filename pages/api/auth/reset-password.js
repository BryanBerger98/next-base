import Token from "../../../models/Token.model"
import User from "../../../models/User.model"
import { sendResetPasswordEmail } from "../../../utils/emails"
import { connectToDatabase } from "../../../utils/mongodb"
import { generateToken, verifyToken } from "../../../utils/tokens"
import { hashPassword } from '../../../utils/password'

export default async function handler(req, res) {

    if (req.method === 'POST') {

        await connectToDatabase()

        const { email } = req.body

        if (!email || !email.includes('@')) {
            return res.status(500).json({ message: 'Invalid input.' })
        }

        const user = await User.findOne({email})

        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }

        const expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 2)
        const token = generateToken(user, expirationDate, 'reset_password')
        const savedToken = await Token.create({token, expiration_date: expirationDate, action: 'reset_password'})

        const emailResponse = sendResetPasswordEmail(user, savedToken)

        return res.status(200).json(emailResponse)
    }

    if (req.method === 'PUT') {

        const { token, password } = req.body

        if (!token) {
            return res.status(401).json({ code: 'auth/invalid-token', message: 'Invalid token.' })
        }

        if (!password || password.length < 8) {
            return res.status(422).json({ code: 'auth/invalid-input', message: 'Invalid input.' })
        }

        const savedToken = await Token.findOne(({token}))

        if (!savedToken) {
            return res.status(404).json({ code: 'auth/token-not-found', message: 'Token not found.'})
        }

        const tokenPayload = verifyToken(savedToken.token)
        const user = await User.findOne({email: tokenPayload.email})

        if (!user) {
            return res.status(404).json({ code: 'auth/user-not-found', message: 'User not found.' })
        }

        const hashedPassword = await hashPassword(password)
        const updatedUser = await User.updateOne({_id: user._id}, {$set: { password: hashedPassword }})

        await Token.deleteOne({_id: savedToken._id})

        return res.status(200).json(updatedUser)
    }

    res.status(404).json({ message: 'Not found' })

}