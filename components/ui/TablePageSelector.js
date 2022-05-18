import { useEffect, useState } from "react"

export default function TablePageSelector({arrayLength, limit, setLimit, skip, setSkip}) {

    const [buttons, setButtons] = useState([]);

    const onChangeLimit = (event) => {
        const value = event.target.value
        setLimit(+value)
    }

    const onChangePage = (event) => {
        const value = event.target.value
        setSkip(limit * (+value - 1))
    }

    useEffect(() => {
        const buttonsCount = Math.ceil(arrayLength / limit)
        const btns = [];
        for (let index = 0; index < buttonsCount; index++) {
            btns.push(index + 1)
        }
        setButtons([...btns])
    }, [limit, arrayLength])

  return (
    <div className="flex items-center justify-between mt-5">
        {buttons && buttons.length > 1 && (
            <select id="usersPerPageSelect" className="appearance-none h-9 rounded-md px-4 drop-shadow text-sm text-indigo-500 dark:text-indigo-300 bg-gray-100 dark:bg-gray-700" onChange={onChangePage}>
                {
                    buttons.map(button => (
                        <option key={`table-page-selector-option-${button}`} value={button}>Page n°{button}</option>
                    ))
                }
            </select>
        )}
        <select id="usersPerPageSelect" value={limit} className="appearance-none h-9 rounded-md px-4 drop-shadow text-sm text-indigo-500 dark:text-indigo-300 bg-gray-100 dark:bg-gray-700 ml-auto" onChange={onChangeLimit}>
            <option value="10">10 / page</option>
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
        </select>
    </div>
  )
}