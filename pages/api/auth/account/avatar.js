import { getSession } from "next-auth/react"
import { connectToDatabase } from "../../../../utils/mongodb"
import multer from 'multer'
import nextConnect from "next-connect"
import { convertFileRequestObjetToModel, generateUniqueNameFromFileName } from "../../../../utils/files"
import FileModel from '../../../../models/File.model'
import UserModel from '../../../../models/User.model'

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
      console.error(error)
      res.status(501).json({ error: `Sorry something Happened! ${error.message}` })
    },
    onNoMatch(req, res) {
      res.status(405).json({ error: `Method '${req.method}' Not Allowed` })
    },
  });
  
  apiRoute.use(upload.single('avatar'))
  
  apiRoute.put(async (req, res) => {
    const session = await getSession({req})

    if (!session) {
        return res.status(401).json({ code: 'auth/unauthorized', message: 'Unauthorized.' })
    }

    // TODO: Remove previous file !!

    const file = {...convertFileRequestObjetToModel(req.file), created_by: session.user._id}
    const savedFile = await FileModel.create(file)
    const updatedUse = await UserModel.updateOne({_id: session.user._id}, { $set: { photo_url: file.path } })

    await connectToDatabase()
    res.status(200).json({savedFile});
  });
  
  export default apiRoute
  
  export const config = {
    api: {
      bodyParser: false, // Disallow body parsing, consume as stream
    },
  };

// export default async function handler(req, res) {

    

//     res.status(404).json({ message: 'Not found.' })

// }