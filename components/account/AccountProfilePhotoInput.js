import { FiUser } from "react-icons/fi"
import { useRef } from 'react'

export default function AccountProfilePhotoInput({ currentUser }) {

    const fileInputRef = useRef()

    const handleFileChange = (e) => {
        console.log(fileInputRef.current.files)

        
    }

    return(
        <div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center text-3xl text-gray-800 my-auto relative overflow-hidden group">
            <FiUser />
            <label htmlFor="updateProfilePhotoInput" className="absolute inset-0 text-xs items-end justify-center hidden group-hover:flex group-hover:cursor-pointer">
                <small className="text-gray-50 bg-gray-800/75 pb-1 w-full text-center">MODIFIER</small>
            </label>
            <input type="file" id="updateProfilePhotoInput" onChange={handleFileChange} ref={fileInputRef} hidden />
        </div>
    )
}