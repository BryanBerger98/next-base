import { Fragment, useState, useEffect } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { FiCheck, FiX } from 'react-icons/fi'
import useTranslate from '../../packages/hooks/translate'

export default function ButtonSavingLoader({ saving, saved, error, loaderOrientation, displayErrorMessage }) {

    const [errorMessage, setErrorMessage] = useState(null)
    const { getTranslatedError } = useTranslate({ locale: 'fr' })

    useEffect(() => {
        if (error && displayErrorMessage) {
            const errMsg = getTranslatedError(error)
            setErrorMessage(errMsg)
        }
    }, [error])

    return(
        <Fragment>
            <div className={`flex items-center transition ease-in-out duration-300 absolute z-0 inset-y-0 ${loaderOrientation === 'left' ? 'left-0' : 'right-0'} ${saving && !saved && loaderOrientation === 'left' ? '-translate-x-9' : saving && !saved ? 'translate-x-9' : ''}`}>
                <AiOutlineLoading3Quarters className={`text-2xl text-indigo-500 dark:text-indigo-300 ${saving && 'animate-spin'}`} />
            </div>
            <div className={`flex items-center gap-1 transition ease-in-out duration-300 absolute z-0 inset-y-0 ${loaderOrientation === 'left' ? 'left-0' : 'right-0'} ${!saving && saved && loaderOrientation === 'left' ? '-translate-x-9' : !saving && saved ? 'translate-x-9' : ''}`}>
                <FiCheck className={`text-2xl text-green-500 dark:text-green-300`} />
            </div>
            <div className={`flex items-center gap-1 transition ease-in-out duration-300 absolute z-0 inset-y-0 ${loaderOrientation === 'left' ? 'left-0' : 'right-0'} ${!saving && !saved && error && loaderOrientation === 'left' ? '-translate-x-9' : !saving && !saved && error ? 'translate-x-9' : ''}`}>
                <FiX className={`text-2xl text-red-500 dark:text-red-300`} />
                { displayErrorMessage && error && errorMessage && <span className='text-red-500 dark:text-red-300 text-sm absolute left-7 whitespace-nowrap'>{errorMessage}</span> }
            </div>
        </Fragment>
    )
}