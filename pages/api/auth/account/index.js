import { connectToDatabase } from "../../../../utils/mongodb"
import { getSession } from "next-auth/react"
import User from "../../../../models/User.model"

export default async function handler(req, res) {

    if (req.method === 'PUT') {

        const { username } = req.body

        if (!username || username.length === 0) {
            return res.status(422).json({ code: 'auth/account/invalid-input', message: 'Invalid input.' })
        }

        const session = await getSession({req})

        if (!session) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        await connectToDatabase()
        const result = await User.updateOne({_id: session.user._id}, { $set: { username } })

        return res.status(200).json(result)

    }

    res.status(404).json({ message: 'Not found.' })

}