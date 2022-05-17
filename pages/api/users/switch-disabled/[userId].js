import User from "../../../../models/User.model"
import { connectToDatabase } from "../../../../utils/mongodb"

export default async function handler(req, res) {

    if (req.method === 'GET') {

        const { userId } = req.query
        
        if (!userId || userId.length === 0) {
            return res.status(422).json({ code: 'users/missing-id', message: 'A user id must be provided.' })
        }
        
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ code: 'users/user-not-found', message: 'User not found.' })
        }

        const updatedUser = await User.updateOne({_id: user._id}, { $set: { disabled: !user.disabled } })

        return res.status(200).json(updatedUser)

    }

    res.status(405).json({ code:'auth/wrong-method', message: 'This request method is not allowed.' })

}