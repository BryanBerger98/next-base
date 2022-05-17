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
        if (sortField && sortField !== '' && sortDirection && sortDirection !== '') {
            if (isNaN(+sortDirection) || (+sortDirection !== -1 && +sortDirection !== 1)) {
                return res.status(422).json({ code: 'users/invalid-input', message: 'Query param `sortDirection` must be -1 or 1' })
            }
            sortParams[sortField] = sortDirection
        } else {
            sortParams = {
                _id: -1
            }
        }

        if (limit && isNaN(+limit)) {
            return res.status(422).json({ code: 'users/invalid-input', message: 'Query param `limit` is NaN' })
        }

        if (limit && +limit <= 0) {
            return res.status(422).json({ code: 'users/invalid-input', message: 'Query param `limit` must be greater than 0' })
        }

        if (skip && isNaN(+skip)) {
            return res.status(422).json({ code: 'users/invalid-input', message: 'Query param `skip` is NaN' })
        }

        if (skip && +skip < 0) {
            return res.status(422).json({ code: 'users/invalid-input', message: 'Query param `skip` must be greater than or equal to 0' })
        }

        const users = await User.find(searchRequest).skip(skip ? +skip : 0).limit(limit ? +limit : 1000).sort(sortParams)
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
            return res.status(422).json({ code: 'users/email-already-in-use', message: 'This email is already in use.' })
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