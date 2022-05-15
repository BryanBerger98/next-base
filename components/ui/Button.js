import Link from "next/link"

export default function Button(props) {

    const variants = {
        primary: 'bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 text-gray-50',
        danger: 'bg-rose-500 hover:bg-rose-600 disabled:bg-rose-400 text-gray-50',
        success: 'bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-gray-50',
        info: 'bg-teal-500 hover:bg-teal-600 disabled:bg-teal-400 text-gray-50',
        warning: 'bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-400 text-gray-50',
    }

    if (props.href) {
        return(
            <Link href={props.href}>
                <a className={`rounded-md flex gap-2 items-center px-3 py-2 ${props.variant ? variants[props.variant] : ''}`}>{props.children}</a>
            </Link>
        )
    }

    return (
        <button className={`rounded-md flex gap-2 items-center px-3 py-2 ${props.variant ? variants[props.variant] : ''}`} onClick={props.onClick} disabled={props.disabled ? true : false} type={props.type ? props.type : 'button'}>{props.children}</button>
    )
}