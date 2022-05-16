import { FiUser } from "react-icons/fi"
import { useRef } from 'react'
import axios from "axios"
import { useAuthContext } from '../../store/authContext'

export default function AccountProfilePhotoInput({ currentUser }) {

    const fileInputRef = useRef()
    const { dispatchCurrentUser } = useAuthContext()

    const handleFileChange = async (e) => {
        try {
            const file = fileInputRef.current.files[0]

            const formData = new FormData()
            formData.append('avatar', file)
            const response = await axios.put('/api/auth/account/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (event) => {
                    console.log(`Current progress: ${Math.round((event.loaded * 100) / event.total)}`)
                }
            })
            const fileData = response.data
            dispatchCurrentUser({
                ...currentUser,
                photo_url: fileData.path
            })
        } catch (error) {
            console.error(error)
        }
    }

    return(
        <div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center text-3xl text-gray-800 my-auto relative overflow-hidden group">
            {
                currentUser && currentUser.photo_url && currentUser.photo_url !== ''
                ? <img src={`/${currentUser.photo_url}`} alt={`${currentUser.username} profile photo`} />
                : <FiUser />
            }
            <label htmlFor="updateProfilePhotoInput" className="absolute inset-0 text-xs items-end justify-center hidden group-hover:flex group-hover:cursor-pointer">
                <small className="text-gray-50 bg-gray-800/75 pb-1 w-full text-center">MODIFIER</small>
            </label>
            <input type="file" id="updateProfilePhotoInput" onChange={handleFileChange} ref={fileInputRef} hidden />
        </div>
    )
}