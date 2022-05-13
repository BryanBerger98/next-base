import Token from "../../../../models/Token.model"
import User from "../../../../models/User.model"
import { sendResetPasswordEmail } from "../../../../utils/emails"
import { connectToDatabase } from "../../../../utils/mongodb"
import { generateToken } from "../../../../utils/tokens"

export default async function handler(req, res) {

    if (req.method === 'GET') {

        await connectToDatabase()

        const { userId } = req.query
        
        if (!userId) {
            return res.status(500).json({ message: 'A user id must be provided.' })
        }

        console.log('USERID', userId)

        const user = await User.findById(userId)

        console.log('USER', user)

        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }

        const expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 2)
        const token = generateToken(user, expirationDate, 'reset_password')
        const savedToken = await Token.create({token, expiration_date: expirationDate, action: 'reset_password'})

        const emailResponse = sendResetPasswordEmail(user, savedToken)

        return res.status(200).json(emailResponse)
    }

    res.status(404).json({ message: 'Not found' })

}