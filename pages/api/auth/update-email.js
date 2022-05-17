import { getSession } from "next-auth/react"
import UserModel from "../../../models/User.model"
import { verifyPassword } from "../../../utils/password"

export default async function handler(req, res) {

    if (req.method === 'PUT') {

        const { email, password } = req.body

        if (!password || password.length < 8 || !email || email.length === 0) {
            return res.status(422).json({ code: 'auth/invalid-input', message: 'Invalid input.' })
        }

        const session = await getSession({req})
        if (!session) {
            return res.status(401).json({ code: 'auth/unauthorized', message: 'Unauthorized.' })
        }

        const currentUser = await UserModel.findById(session.user._id)

        const isPasswordVerified = await verifyPassword(password, currentUser.password)
        if (!isPasswordVerified) {
            return res.status(403).json({ code: 'auth/wrong-password', message: 'Wrong password' })
        }

        await UserModel.updateOne({_id: currentUser._id}, { $set: { email } })

        return res.status(200).json({ message: 'Email updated.' })
    }

    res.status(405).json({ code:'auth/wrong-method', message: 'This request method is not allowed.' })

}