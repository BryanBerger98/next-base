import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { FiLogOut, FiSettings, FiUser } from 'react-icons/fi'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'

export default function AccountDropDownMenu() {

  const router = useRouter()

    function logoutHandler() {
        signOut()
    }

  return (
    <Menu as="div" className="relative inline-block text-left">
        <div>
            <Menu.Button className='bg-indigo-500 flex items-center justify-center text-md text-slate-50 rounded-full w-9 h-9 hover:cursor-pointer hover:bg-indigo-600 focus:outline-none'>
                <FiUser />
            </Menu.Button>
        </div>
        <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        >
        <Menu.Items className="absolute right-0 w-60 mt-2 origin-top-right bg-gray-100 divide-y divide-gray-300/25 rounded-lg drop-shadow-md focus:outline-none">
            <div className="px-1 py-1">
                <Menu.Item>
                    {({ active }) => (
                    <button
                        className={`${
                        active ? 'bg-indigo-500 text-white' : 'text-gray-900'
                        } group flex rounded-lg items-center w-full px-2 py-2 text-sm`}
                        onClick={() => {router.push('/account')}}
                    >
                        {active ? (
                        <FiUser
                            className="w-5 h-5 mr-2"
                            aria-hidden="true"
                        />
                        ) : (
                        <FiUser
                            className="w-5 h-5 mr-2 text-indigo-500"
                            aria-hidden="true"
                        />
                        )}
                        Mon compte
                    </button>
                    )}
                </Menu.Item>
                <Menu.Item>
                    {({ active }) => (
                    <button
                        className={`${
                        active ? 'bg-indigo-500 text-white' : 'text-gray-900'
                        } group flex rounded-lg items-center w-full px-2 py-2 text-sm`}
                        onClick={() => {router.push('users/edit/'+user._id)}}
                    >
                        {active ? (
                        <FiSettings
                            className="w-5 h-5 mr-2"
                            aria-hidden="true"
                        />
                        ) : (
                        <FiSettings
                            className="w-5 h-5 mr-2 text-indigo-500"
                            aria-hidden="true"
                        />
                        )}
                        Paramètres
                    </button>
                    )}
                </Menu.Item>
            </div>
            <div className="px-1 py-1">
                <Menu.Item>
                {({ active }) => (
                    <button
                    className={`${
                        active ? 'bg-rose-500 text-white' : 'text-gray-900'
                    } group flex rounded-lg items-center w-full px-2 py-2 text-sm`}
                    onClick={logoutHandler}
                    >
                    {active ? (
                        <FiLogOut
                        className="w-5 h-5 mr-2"
                        aria-hidden="true"
                        />
                    ) : (
                        <FiLogOut
                        className="w-5 h-5 mr-2 text-rose-500"
                        aria-hidden="true"
                        />
                    )}
                    Déconnexion
                    </button>
                )}
                </Menu.Item>
            </div>
        </Menu.Items>
        </Transition>
    </Menu>
  )
}