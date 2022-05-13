import { Schema, model, models } from 'mongoose'

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    action: {
        type: String,
        required: true,
        enum: ['reset_password', 'account_verification']
    },
    expiration_date: {
        type: Date,
        required: true
    },
    created_on: {
        type: Date,
        default: Date.now()
    }
})

const Token = models.Token || model('Token', tokenSchema)

export default Token