import { Fragment, useState, useEffect } from 'react'
import { FiArrowDown, FiArrowUp } from 'react-icons/fi'
import TablePageSelector from './TablePageSelector'

export default function Table({dataLoading, dataCount, fields, defaultLimit, defaultSkip, defaultSort, onReloadTable, children}) {

    const [limit, setLimit] = useState(defaultLimit)
    const [skip, setSkip] = useState(defaultSkip)
    const [sort, setSort] = useState(defaultSort)

    const onChangeSort = (field, direction) => {
        setSort({field, direction})
    }

    useEffect(() => {
        onReloadTable(limit, skip, sort)
        localStorage.setItem('usersTableConfig', JSON.stringify({limit, skip, sort}))
    }, [limit, skip, sort])

    return(
        <Fragment>
            <table className="w-full text-sm">
                <thead>
                    <tr>
                        {
                            fields.map((field, index) => (
                                field.sortable ?
                                <th key={field.name + '-' + index} className={`text-center font-${field.fontStyle ? field.fontStyle : 'semibold'} border-b border-gray-400 dark:border-gray-700 py-2 hover:cursor-pointer`} onClick={() => onChangeSort(field.name, sort.direction === 1 ? -1 : 1)}>
                                    <span className={`flex gap-1 items-center justify-${field.align === 'left' ? 'start' : field.align === 'right' ? 'end' : 'center'}`}>
                                        <span>{field.title}</span>
                                        {sort.field === field.name && sort.direction === 1 && <FiArrowUp />}
                                        {sort.field === field.name && sort.direction === -1 && <FiArrowDown />}
                                    </span>
                                </th>
                                : <th key={field.name + '-' + index} className={`font-${field.fontStyle ? field.fontStyle : 'semibold'} border-b border-gray-400 dark:border-gray-700 py-2`}>
                                    <span className={`flex gap-1 items-center justify-${field.align === 'left' ? 'start' : field.align === 'right' ? 'end' : 'center'}`}>
                                        <span>{field.title}</span>
                                    </span>
                                </th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {!dataLoading && children}
                    {
                        dataLoading &&
                        Array.from(Array(limit), (element, index) => (
                            <tr className="animate-pulse" key={'table-pulse' + element + index}>
                                <td className="py-3 border-b-[0.5px] border-gray-300 dark:border-gray-700">
                                    <div className="w-44 bg-gray-300 dark:bg-gray-700 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-3 border-b-[0.5px] border-gray-300 dark:border-gray-700">
                                    <div className="w-64 bg-gray-300 dark:bg-gray-700 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-3 border-b-[0.5px] border-gray-300 dark:border-gray-700">
                                    <div className="w-36 bg-gray-300 dark:bg-gray-700 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300 dark:border-gray-700">
                                    <div className="w-28 bg-gray-300 dark:bg-gray-700 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300 dark:border-gray-700">
                                    <div className="w-28 bg-gray-300 dark:bg-gray-700 h-5 rounded-md">

                                    </div>
                                </td>
                                <td className="py-2 border-b-[0.5px] border-gray-300 dark:border-gray-700 text-center">
                                    <div className="w-10 mx-auto bg-gray-300 dark:bg-gray-700 h-5 rounded-md">

                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            {!dataLoading && <TablePageSelector arrayLength={dataCount} limit={limit} setLimit={setLimit} skip={skip} setSkip={setSkip} />}
        </Fragment>
    )
}