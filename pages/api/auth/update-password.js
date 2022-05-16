import { getSession } from "next-auth/react"
import UserModel from "../../../models/User.model"
import { hashPassword, verifyPassword } from "../../../utils/password"

export default async function handler(req, res) {

    if (req.method === 'PUT') {

        const { oldPassword, newPassword } = req.body

        if (!oldPassword || oldPassword.length < 8 || !newPassword || newPassword.length < 8) {
            return res.status(422).json({ code: 'auth/invalid-input', message: 'Invalid input.' })
        }

        const session = await getSession({req})
        if (!session) {
            return res.status(401).json({ code: 'auth/unauthorized', message: 'Unauthorized.' })
        }

        const currentUser = await UserModel.findById(session.user._id)

        const isPasswordVerified = await verifyPassword(oldPassword, currentUser.password)
        if (!isPasswordVerified) {
            return res.status(403).json({ code: 'auth/wrong-password', message: 'Wrong password' })
        }

        const hashedNewPassword = await hashPassword(newPassword)

        await UserModel.updateOne({_id: currentUser._id}, { $set: { password: hashedNewPassword } })

        return res.status(200).json({ message: 'Password updated.' })

    }

    res.status(405).json({ code:'auth/wrong-method', message: 'This request method is not allowed.' })

}