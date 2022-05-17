import Link from "next/link"

export default function Button({variant, href, onClick, disabled, type, children}) {

    const variants = {
        primary: 'bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 disabled:text-white text-gray-50',
        danger: 'bg-rose-500 hover:bg-rose-600 disabled:bg-rose-400 disabled:text-white text-gray-50',
        success: 'bg-green-500 hover:bg-green-600 disabled:bg-green-400 disabled:text-white text-gray-50',
        info: 'bg-teal-500 hover:bg-teal-600 disabled:bg-teal-400 disabled:text-white text-gray-50',
        warning: 'bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-400 disabled:text-white text-gray-50',
        light: 'bg-gray-100 hover:bg-gray-200 disabled:bg-white disabled:text-gray-500 text-gray-800',
        dark: 'bg-gray-800 hover:bg-gray-900 disabled:bg-gray-600 disabled:text-white text-gray-50',
        'primary-gradient': 'bg-gradient-to-r from-indigo-700 to-indigo-500 text-gray-50 rounded-md hover:from-indigo-800 hover:to-indigo-600',
        link: 'text-gray-500 hover:underline'
    }

    if (href) {
        return(
            <Link href={href}>
                <a className={`rounded-md flex gap-2 items-center px-3 py-2 ${variant ? variants[variant] : ''}`}>{children}</a>
            </Link>
        )
    }

    return (
        <button className={`rounded-md flex gap-2 items-center px-3 py-2 ${variant ? variants[variant] : ''}`} onClick={onClick} disabled={disabled ? true : false} type={type ? type : 'button'}>{children}</button>
    )
}