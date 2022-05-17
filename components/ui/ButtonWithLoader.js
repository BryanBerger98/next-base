import Button from "./Button";
import ButtonSavingLoader from "./ButtonSavingLoader";
import { useEffect, useState } from 'react'

export default function ButtonWithLoader({href, variant, type, onClick, disabled, saving, loaderOrientation, error, displayErrorMessage, children}) {

    const [firstLoad, setFirstLoad] = useState(true)
    const [saved, setSaved] = useState(false)
    const [savedDelay, setSavedDelay] = useState(null)

    useEffect(() => {
        if (saving) {
            setFirstLoad(false)
            setSaved(false)
            if (savedDelay) clearTimeout(savedDelay)
        }
        if (!saving && !error && !firstLoad) {
            setSaved(true)
            const delay = setTimeout(() => {
                setSaved(false)
            }, 3000)
            setSavedDelay(delay)
        }
    }, [saving])

    return(
        <div className="relative w-fit">
            <div className="relative z-10 w-fit">
                <Button variant={variant} type={type} onClick={onClick} href={href} disabled={disabled ? disabled : saving}>
                    {children}
                </Button>
            </div>
            <ButtonSavingLoader saved={saved} saving={saving} loaderOrientation={loaderOrientation} error={error} displayErrorMessage={displayErrorMessage} />
        </div>
    )
}