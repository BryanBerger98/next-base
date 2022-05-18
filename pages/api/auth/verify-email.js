import { getSession } from "next-auth/react"
import TokenModel from "../../../models/Token.model"
import UserModel from "../../../models/User.model"
import { sendAccountVerificationEmail } from "../../../utils/emails"
import { connectToDatabase } from "../../../utils/mongodb"
import { generateToken, verifyToken } from "../../../utils/tokens"

export default async function handler(req, res) {

    if (req.method === 'GET') {

        await connectToDatabase()

        const session = await getSession({req})
        if (!session) {
            return res.status(401).json({ code: 'auth/unauthorized', message: 'Unauthorized.' })
        }

        const user = await UserModel.findById(session.user._id)

        if (!user) {
            return res.status(404).json({ code: 'auth/user-not-found', message: 'User not found.' })
        }

        if (user.email_verified) {
            return res.status(409).json({ code: 'auth/user-already-verified', message: 'User email already verified.' })
        }

        const expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 24)
        const token = generateToken(user, expirationDate, 'account_verification')
        const savedToken = await TokenModel.create({token, expiration_date: expirationDate, action: 'account_verification'})

        const emailResponse = sendAccountVerificationEmail(user, savedToken)

        return res.status(200).json(emailResponse)

    }

    if (req.method === 'PUT') {
        const { token } = req.body

        const session = await getSession({req})
        if (!session) {
            return res.status(401).json({ code: 'auth/unauthorized', message: 'Unauthorized.' })
        }

        if (!token) {
            return res.status(401).json({ code: 'auth/invalid-token', message: 'Invalid token.' })
        }

        const savedToken = await TokenModel.findOne(({token}))

        if (!savedToken) {
            return res.status(404).json({ code: 'auth/token-not-found', message: 'Token not found.'})
        }

        const tokenPayload = verifyToken(savedToken.token)
        const user = await UserModel.findOne({email: tokenPayload.email})

        if (!user) {
            return res.status(404).json({ code: 'auth/user-not-found', message: 'User not found.' })
        }

        if (user._id.toHexString() !== session.user._id) {
            return res.status(401).json({ code: 'auth/wrong-token', message: 'Provided token does not match the user.' })
        }

        if (user.email_verified) {
            return res.status(409).json({ code: 'auth/user-already-verified', message: 'User email already verified.' })
        }

        const updatedUser = await UserModel.updateOne({_id: user._id}, {$set: { email_verified: true }})

        await TokenModel.deleteOne({_id: savedToken._id})

        return res.status(200).json(updatedUser)
    }

    res.status(405).json({ code:'auth/wrong-method', message: 'This request method is not allowed.' })
}