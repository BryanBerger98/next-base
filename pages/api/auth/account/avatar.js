import { getSession } from "next-auth/react"
import { connectToDatabase } from "../../../../utils/mongodb"
import multer from 'multer'
import nextConnect from "next-connect"
import { convertFileRequestObjetToModel, generateUniqueNameFromFileName } from "../../../../utils/files"
import FileModel from '../../../../models/File.model'
import UserModel from '../../../../models/User.model'
import fs from 'fs/promises'

const upload = multer({
    storage: multer.diskStorage({
      destination: './public/uploads',
      filename: async (req, file, cb) => {
        try {
          const generatedFileName = await generateUniqueNameFromFileName(file.originalname)
          return cb(null, generatedFileName)
        } catch (error) {
          return cb(err)
        }
      }
    }),
    limits: {
      fileSize: 2097152
    }
  })
  
  const apiRoute = nextConnect({
    onError(error, req, res) {
      res.status(501).json({ code: 'auth/error', message: error.message })
    },
    onNoMatch(req, res) {
      res.status(405).json({ code:'auth/wrong-method', message: 'This request method is not allowed.' })
    }
  })
  
  apiRoute.use(upload.single('avatar'))
  
  apiRoute.put(async (req, res) => {
    const session = await getSession({req})

    if (!session) {
        return res.status(401).json({ code: 'auth/unauthorized', message: 'Unauthorized.' })
    }

    await connectToDatabase()

    const currentUser = await UserModel.findById(session.user._id)

    if (currentUser.photo_url && currentUser.photo_url !== '') {
      const oldFile = await FileModel.findOne({path: currentUser.photo_url})
      if (oldFile) {
        try {
          await fs.unlink(`./public/${oldFile.path}`)
          await FileModel.findByIdAndDelete(oldFile._id)
        } catch (error) {
          console.error('ERROR - Deleting avatar >', error)
        }
      }
    }

    const file = {...convertFileRequestObjetToModel(req.file), created_by: currentUser._id}
    try {
      const savedFile = await FileModel.create(file)
      const updatedUse = await UserModel.updateOne({_id: currentUser._id}, { $set: { photo_url: file.path } })
      return res.status(200).json(savedFile)
    } catch (error) {
      console.error('ERROR - Saving avatar >', error)
      return res.status(500).json({ code: 'auth/error', message: error.message }) 
    }

  });
  
  export default apiRoute
  
  export const config = {
    api: {
      bodyParser: false
    }
  }