import { Schema, model, models } from 'mongoose'

const fileSchema = new Schema({
    original_name: {
        type: String,
        default: ''
    },
    custom_name: {
        type: String,
        default: ''
    },
    mimetype: {
        type: String,
        default: ''
    },
    extension: {
        type: String,
        default: ''
    },
    encoding: {
        type: String,
        default: ''
    },
    size: {
        type: Number,
        default: 0
    },
    file_name: {
        type: String,
        default: ''
    },
    path: {
        type: String,
        default: ''
    },
    destination: {
        type: String,
        default: ''
    },
    created_on: {
        type: Date,
        default: Date.now()
    },
    created_by: {
        type: Schema.Types.ObjectId,
        default: null
    }
})

const File = models.File || model('File', fileSchema)

export default File