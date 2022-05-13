import { connectToDatabase } from '../../../utils/mongodb'
import { hashPassword } from '../../../utils/password'
import User from '../../../models/User.model'

export default async function handler(req, res) {
    
    if (req.method !== 'POST') {
        res.status(404).json({ message: 'Not found' })
    }

    const { email, password } = req.body

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

    // const newUser = new User({
    //     email,
    //     password: hashedPassword
    // })

    const result = await User.create({
        email,
        password: hashedPassword
    })

    res.status(201).json(result)

}