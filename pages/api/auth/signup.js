import { connectToDatabase } from '../../../utils/mongodb'
import { hashPassword } from '../../../utils/password'
import User from '../../../models/User.model'

export default async function handler(req, res) {

    if (req.method === 'POST') {
        
        const { email, password } = req.body
    
        if (!email || !email.includes('@') || !password || password.trim().length < 8) {
            return res.status(422).json({ code: 'auth/invalid-input', message: 'Invalid input on email or password.' })
        }
    
        await connectToDatabase()
    
        const existingUser = await User.findOne({email})
    
        if (existingUser) {
            return res.status(422).json({ code: 'auth/email-already-in-use', message: 'This email is already in use.' })
        }
    
        const hashedPassword = await hashPassword(password)
    
        const result = await User.create({
            email,
            password: hashedPassword
        })
    
        return res.status(201).json(result)

    }

    res.status(405).json({ code:'auth/wrong-method', message: 'This request method is not allowed.' })

}