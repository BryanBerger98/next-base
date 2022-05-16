import { connectToDatabase } from "../../../../utils/mongodb"
import { getSession } from "next-auth/react"
import User from "../../../../models/User.model"

export default async function handler(req, res) {

    if (req.method === 'PUT') {

        const session = await getSession({req})

        if (!session) {
            return res.status(401).json({  code: 'auth/unauthorized', message: 'Unauthorized.' })
        }

        const { username } = req.body

        if (!username || username.length === 0) {
            return res.status(422).json({ code: 'auth/invalid-input', message: 'Invalid input.' })
        }

        await connectToDatabase()
        const result = await User.updateOne({_id: session.user._id}, { $set: { username } })

        return res.status(200).json(result)

    }

    if (req.method === 'GET') {
        const session = await getSession({req})

        if (!session) {
            return res.status(401).json({ code: 'auth/unauthorized', message: 'Unauthorized.' })
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