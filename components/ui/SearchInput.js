import { FiSearch } from "react-icons/fi"

export default function SearchInput({ onSearchElements }) {
    let delay

    const onSearch = (event) => {
        const value = event.currentTarget.value.trim()
        clearDelay()
        delay = setTimeout(() => {
            onSearchElements(value)
        }, 400)
    }

    const clearDelay = () => {
        clearTimeout(delay)
    }

  return (
    <div className="relative text-sm">
        <input type="search" placeholder='Rechercher...' className="bg-gray-100 placeholder:text-gray-400 p-2 rounded-md pl-8 w-full" onKeyDown={clearDelay} onChange={onSearch} />
        <FiSearch className="absolute text-base text-gray-400 left-2 inset-y-0 my-auto" />
    </div>
  )
}