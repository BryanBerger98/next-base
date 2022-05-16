import { getSession } from "next-auth/react"
import User from "../../../models/User.model"
import { connectToDatabase } from "../../../utils/mongodb"

export default async function handler(req, res) {

    if (req.method === 'GET') {

        const session = await getSession({req})

        if (!session) {
            return res.status(401).json({ code: 'auth/unauthorized', message: 'Unauthorized' })
        }

        await connectToDatabase()

        const currentUser = await User.findById(session.user._id, { password: 0 })

        if (!currentUser) {
            return res.status(404).json({ code: 'auth/user-not-found', message: 'User not found' })
        }

        return res.status(200).json(currentUser)

    }

    res.status(404).json({ message: 'Not found.' })

}