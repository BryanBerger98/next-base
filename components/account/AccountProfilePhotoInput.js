import { FiUser } from "react-icons/fi"
import { useRef, useState } from 'react'
import { useAuthContext } from '../../store/authContext'
import Image from "next/image"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { updateAvatar } from "../../packages/api/auth"

export default function AccountProfilePhotoInput({ currentUser }) {

    const fileInputRef = useRef()
    const { dispatchCurrentUser } = useAuthContext()
    const [saving, setSaving] = useState(false)

    const handleFileChange = async (e) => {
        try {
            setSaving(true)
            const file = fileInputRef.current.files[0]
            const fileData = await updateAvatar(file)
            dispatchCurrentUser({
                ...currentUser,
                photo_url: fileData.path
            })
            setSaving(false)
        } catch (error) {
            console.error(error)
        }
    }

    return(
        <div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center text-3xl text-gray-800 my-auto relative overflow-hidden group">
            {
                currentUser && currentUser.photo_url && currentUser.photo_url !== ''
                ? <Image src={`/${currentUser.photo_url}`} alt={`${currentUser.username} profile photo`} width={80} height={80} />
                : <FiUser />
            }
            {
                saving &&
                <div className="bg-gray-800/50 flex items-center justify-center absolute inset-0 z-10">
                    <AiOutlineLoading3Quarters className={`text-2xl text-gray-50 ${saving && 'animate-spin'}`} />
                </div>
            }
            {
                !saving &&
                <label htmlFor="updateProfilePhotoInput" className="absolute inset-0 text-xs items-end justify-center hidden group-hover:flex group-hover:cursor-pointer">
                    <small className="text-gray-50 bg-gray-800/75 pb-1 w-full text-center">MODIFIER</small>
                </label>
            }
            <input type="file" id="updateProfilePhotoInput" onChange={handleFileChange} ref={fileInputRef} hidden />
        </div>
    )
}