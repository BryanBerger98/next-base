import { connectToDatabase } from '../../../utils/mongodb'
import { hashPassword, generatePassword } from '../../../utils/password'
import User from '../../../models/User.model'

export default async function handler(req, res) {

    if (req.method === 'GET') {

        await connectToDatabase()

        const { sortField, sortDirection, limit, skip, search } = req.query

        const searchArray = search && search !== '' ? search.trim().split(' ') : []
        const searchRegexArray = searchArray.map(string => new RegExp(string, 'i'))

        const searchRequest = searchRegexArray.length > 0 ? {$or: [{ username: {$in: searchRegexArray} }, {email: {$in: searchRegexArray}}]} : {}
        let sortParams = {}
        sortParams[sortField] = sortDirection

        const users = await User.find(searchRequest).skip(+skip).limit(+limit).sort(sortParams)
        const count = users.length
        const total = await User.find().count()

        const result = {
            users,
            count,
            total
        }
        return res.status(200).json(result)
    }

    if (req.method === 'POST') {
        const { email, username, role, phone_number } = req.body

        if (!email || !email.includes('@')) {
            return res.status(422).json({ code: 'users/invalid-input', message: 'Invalid input on email.' })
        }

        const password = generatePassword(12)
        await connectToDatabase()
        const existingUser = await User.findOne({email})

        if (existingUser) {
            return res.status(422).json({ code: 'auth/email-already-in-use', message: 'This email is already in use.' })
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

        if (user.password) {
            delete user.password
        }

        await connectToDatabase()

        const updatedUser = await User.updateOne({_id: user._id}, { $set: {...user} })

        return res.status(200).json(updatedUser)

    }

    res.status(405).json({ code:'users/wrong-method', message: 'This request method is not allowed.' })

}