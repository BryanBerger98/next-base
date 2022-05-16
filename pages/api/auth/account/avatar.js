import { getSession } from "next-auth/react"
import { connectToDatabase } from "../../../../utils/mongodb"
import multer from 'multer'
import nextConnect from "next-connect"

const upload = multer({
    storage: multer.diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
    }),
  })
  
  const apiRoute = nextConnect({
    onError(error, req, res) {
      res.status(501).json({ error: `Sorry something Happened! ${error.message}` })
    },
    onNoMatch(req, res) {
      res.status(405).json({ error: `Method '${req.method}' Not Allowed` })
    },
  });
  
  apiRoute.use(upload.array('theFiles'));
  
  apiRoute.put((req, res) => {
    const session = await getSession({req})

    if (!session) {
        return res.status(401).json({ code: 'auth/unauthorized', message: 'Unauthorized.' })
    }

    await connectToDatabase()
    res.status(200).json({ data: 'success' });
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