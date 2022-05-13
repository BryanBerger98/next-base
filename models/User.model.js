import { Schema, model, models } from 'mongoose'

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    index: true
  },
  email_verified: {
      type: Boolean,
      default: false
  },
  password: {
      type: String,
      required: true
  },
  role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
  },
  username: {
      type: String
  },
  phone_number: {
      type: String
  },
  photo_url: {
      type: String
  },
  disabled: {
      type: Boolean,
      default: false
  },
  provider_data: {
      type: String
  },
  created_on: {
      type: Date,
      default: new Date()
  }
})

const User = models.User || model('User', userSchema)

export default User