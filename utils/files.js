import crypto from 'crypto'
import path from 'path'

export function getExtensionFromFileName(filename) {
    const fileNameArray = filename.split('.')
    return fileNameArray[fileNameArray.length - 1]
}

export function generateUniqueNameFromFileName(filename) {
    return new Promise((resolve, reject) => {
        crypto.pseudoRandomBytes(16, (err, raw) => {
            if (err) {
                return reject(err)
            }
            const generatedName = raw.toString('hex') + '-' + path.basename(filename).replace(/\s/g,'')
            resolve(generatedName)
        })
    })
}

export function convertFileRequestObjetToModel(fileObj) {

    const pathArray = fileObj.path.split('/')
    pathArray.splice(0, 1)
    const path = pathArray.join('/')

    const file = {
        original_name: fileObj.originalname,
        custom_name: fileObj.originalname,
        mimetype: fileObj.mimetype,
        encoding: fileObj.encoding,
        extension: fileObj.originalname.split('.')[fileObj.originalname.split('.').length - 1],
        size: fileObj.size,
        file_name: fileObj.filename.replace(/\s/g,''),
        path: path.replace(/\s/g,''),
        destination: fileObj.destination
    }
    return file
}