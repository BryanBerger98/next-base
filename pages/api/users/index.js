import { connectToDatabase } from '../../../utils/mongodb'
import { hashPassword, generatePassword } from '../../../utils/password'
import User from '../../../models/User.model'

export default async function handler(req, res) {

    if (req.method === 'POST') {
        const { email, username, role, phone_number } = req.body
        const password = generatePassword(12)

        if (!email || !email.includes('@') || !password || password.trim().length < 8) {
            res.status(422).json({ code: 'auth/invalid-input', message: 'Invalid input on email or password.' })
            return
        }

        await connectToDatabase()

        const existingUser = await User.findOne({email})

        if (existingUser) {
            res.status(422).json({ code: 'auth/email-already-in-use', message: 'This email is already in use.' })
            return
        }

        const hashedPassword = await hashPassword(password)

        const result = await User.create({
            email,
            password: hashedPassword,
            username,
            role,
            phone_number
        })

        return res.status(201).json(result)
    }

    if (req.method === 'PUT') {

        const user = req.body

        if (!user || !user._id) {
            return res.status(500).json({ code: 'users/no-user-provided', message: 'A valid user must be provided.' })
        }

        console.log(user)

        if (user.password) {
            delete user.password
        }

        console.log(user)

        await connectToDatabase()

        const updatedUser = await User.updateOne({_id: user._id}, { $set: {...user} })

        return res.status(200).json(updatedUser)

    }

    res.status(404).json({ message: 'Not found' })

}