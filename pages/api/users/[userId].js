import User from "../../../models/User.model"

export default async function handler(req, res) {
    
    if (req.method === 'DELETE') {

        const { userId } = req.query

        if (!userId || userId.length === 0) {
            return res.status(422).json({ code: 'users/missing-id', message: 'A user id must be provided.' })
        }

        const result = await User.deleteOne({_id: userId})

        return res.status(200).json(result)
    }

    if (req.method === 'GET') {

        const { userId } = req.query

        if (!userId || userId.length === 0) {
            return res.status(422).json({ code: 'users/missing-id', message: 'A user id must be provided.' })
        }

        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ code: 'users/user-not-found', message: 'User not found/' })
        }

        return res.status(200).json(user)
    }

    res.status(405).json({ code:'users/wrong-method', message: 'This request method is not allowed.' })

}