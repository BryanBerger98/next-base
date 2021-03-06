import { Menu, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { FiCheck, FiEdit, FiKey, FiLock, FiMoreVertical, FiSend, FiTrash, FiUnlock, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Modal from '../ui/Modal'
import { useUsersContext } from '../../store/usersContext'
import { useRouter } from 'next/router'
import Button from '../ui/Button'
import { deleteUserById, sendResetPasswordEmailToUser, switchDisabledUser } from '../../packages/api/users'

export default function UserTableDataMenu({user, currentUser}) {

  const { deleteUser, updateUser } = useUsersContext()
  const router = useRouter()

  const [isDisableUserModalOpen, setIsDisableUserModalOpen] = useState(false)
  const [isEnableUserModalOpen, setIsEnableUserModalOpen] = useState(false)
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false)
  const [confirmDeleteUserInputValue, setConfirmDeleteUserInputValue] = useState('')

  const onSendResetPasswordEmail = () => {
    sendResetPasswordEmailToUser(user._id)
    .then(() => {
      toast.custom(
        <div className='flex items-center gap-4 bg-indigo-500 text-gray-50 text-medium text-base px-5 py-3 rounded-md drop-shadow'>
          <FiSend /><span>Email envoyé !</span>
        </div>
      )
    })
    .catch(error => {
      toast.custom(
        <div className='flex items-center gap-4 bg-red-500 text-gray-50 text-medium text-base px-5 py-3 rounded-md drop-shadow'>
          <FiX /><span>Une erreur est survenue</span>
        </div>
      )
      console.error(error)
    })
  }
    
  const onSwitchDisableUser = () => {
    if (!user.disabled) setIsDisableUserModalOpen(true)
    if (user.disabled) setIsEnableUserModalOpen(true)
  }

  const onConfirmSwitchDisableUser = () => {
    switchDisabledUser(user._id).then(() => {
      toast.custom(
        <div className='flex items-center gap-4 bg-green-500 text-gray-50 text-medium text-base px-5 py-3 rounded-md drop-shadow'>
          <FiCheck /><span>Modification enregistrée</span>
        </div>
      )
      updateUser({...user, disabled: !user.disabled})
    }).catch(error => {
      toast.custom(
        <div className='flex items-center gap-4 bg-red-500 text-gray-50 text-medium text-base px-5 py-3 rounded-md drop-shadow'>
          <FiX /><span>Une erreur est survenue</span>
        </div>
      )
      console.error(error)
    }).finally(() => {
      setIsDisableUserModalOpen(false)
      setIsEnableUserModalOpen(false)
    })    
  }

  const onConfirmDeleteUser = async () => {
    try {
      await deleteUserById(user._id)
      deleteUser(user._id)
      toast.custom(
        <div className='flex items-center gap-4 bg-green-500 text-gray-50 text-medium text-base px-5 py-3 rounded-md drop-shadow'>
          <FiTrash /><span>Utilisateur supprimé</span>
        </div>
      )
    } catch (error) {
      toast.custom(
        <div className='flex items-center gap-4 bg-red-500 text-gray-50 text-medium text-base px-5 py-3 rounded-md drop-shadow'>
          <FiX /><span>Une erreur est survenue</span>
        </div>
      )
      console.error(error)
    }
    setIsDeleteUserModalOpen(false)
    setConfirmDeleteUserInputValue('')
  }

  return (
    <>
      <div className="">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 rounded-lg focus:outline-none">
              <FiMoreVertical />
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
            <Menu.Items className="absolute right-0 w-60 mt-2 origin-top-right bg-gray-100 dark:bg-gray-700 divide-y divide-gray-300/25 rounded-lg drop-shadow-md focus:outline-none z-50">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-indigo-500 text-white dark:bg-indigo-300 dark:text-gray-700' : 'text-gray-900 dark:text-gray-200'
                      } group flex rounded-lg items-center w-full px-2 py-2 text-sm`}
                      onClick={() => {router.push('users/edit/'+user._id)}}
                    >
                      {active ? (
                        <FiEdit
                          className="w-5 h-5 mr-2"
                          aria-hidden="true"
                        />
                      ) : (
                        <FiEdit
                          className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-300"
                          aria-hidden="true"
                        />
                      )}
                      Modifier
                    </button>
                  )}
                </Menu.Item>
                {
                  !user.disabled &&
                  <>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-indigo-500 text-white dark:bg-indigo-300 dark:text-gray-700' : 'text-gray-900 dark:text-gray-200'
                          } group flex rounded-lg items-center w-full px-2 py-2 text-sm`}
                          onClick={onSendResetPasswordEmail}
                        >
                          {active ? (
                            <FiKey
                              className="w-5 h-5 mr-2"
                              aria-hidden="true"
                            />
                          ) : (
                            <FiKey
                              className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-300"
                              aria-hidden="true"
                            />
                          )}
                          Réinitialiser le mot de passe
                        </button>
                      )}
                    </Menu.Item>
                    {
                      currentUser && currentUser._id !== user._id && 
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-yellow-500 text-white dark:bg-yellow-300 dark:text-gray-700' : 'text-gray-900 dark:text-gray-200'
                            } group flex rounded-lg items-center w-full px-2 py-2 text-sm`}
                            onClick={onSwitchDisableUser}
                          >
                            {active ? (
                              <FiLock
                                className="w-5 h-5 mr-2"
                                aria-hidden="true"
                              />
                            ) : (
                              <FiLock
                                className="w-5 h-5 mr-2 text-yellow-500 dark:text-yellow-300"
                                aria-hidden="true"
                              />
                            )}
                            Suspendre le compte
                          </button>
                        )}
                      </Menu.Item>
                    }
                  </>
                }
                {
                  user.disabled &&
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-yellow-500 text-white dark:bg-yellow-300 dark:text-gray-700' : 'text-gray-900 dark:text-gray-200'
                        } group flex rounded-lg items-center w-full px-2 py-2 text-sm`}
                        onClick={onSwitchDisableUser}
                      >
                        {active ? (
                          <FiUnlock
                            className="w-5 h-5 mr-2"
                            aria-hidden="true"
                          />
                        ) : (
                          <FiUnlock
                            className="w-5 h-5 mr-2 text-yellow-500 dark:text-yellow-300"
                            aria-hidden="true"
                          />
                        )}
                        Débloquer le compte
                      </button>
                    )}
                  </Menu.Item>
                }
              </div>
              {
                currentUser && currentUser._id !== user._id &&
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-rose-500 text-white dark:bg-rose-300 dark:text-gray-700' : 'text-gray-900 dark:text-gray-200'
                        } group flex rounded-lg items-center w-full px-2 py-2 text-sm`}
                        onClick={() => setIsDeleteUserModalOpen(true)}
                      >
                        {active ? (
                          <FiTrash
                            className="w-5 h-5 mr-2"
                            aria-hidden="true"
                          />
                        ) : (
                          <FiTrash
                            className="w-5 h-5 mr-2 text-rose-500 dark:text-rose-300"
                            aria-hidden="true"
                          />
                        )}
                        Supprimer
                      </button>
                    )}
                  </Menu.Item>
                </div>
              }
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <Modal isOpen={isDisableUserModalOpen} closeModal={() => setIsDisableUserModalOpen(false)} title={{text: <span className='flex items-center gap-2'><FiLock /><span>Suspendre ce compte</span></span>, color: 'text-yellow-500'}}>
        <div className="my-5">
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Une fois suspendu, l'utilisateur de ce compte ne pourra plus se connecter aux applications utilisant O'Keys.
          </p>
        </div>

        <div className="mt-4 flex text-sm justify-end">
          <Button variant={'warning'} onClick={onConfirmSwitchDisableUser}>
            Confirmer
          </Button>
        </div>
      </Modal>
      <Modal isOpen={isEnableUserModalOpen} closeModal={() => setIsEnableUserModalOpen(false)} title={{text: <span className='flex items-center gap-2'><FiUnlock /><span>Débloquer ce compte</span></span>, color: 'text-yellow-500'}}>
        <div className="my-5">
          <p className="text-sm text-gray-500">
            L'utilisateur de ce compte pourra de nouveau se connecter aux applications utilisant O'Keys.
          </p>
        </div>

        <div className="mt-4 flex text-sm justify-end">
          <Button variant={'warning'} onClick={onConfirmSwitchDisableUser}>
            Confirmer
          </Button>
        </div>
      </Modal>
      <Modal isOpen={isDeleteUserModalOpen} closeModal={() => setIsDeleteUserModalOpen(false)} title={{text: <span className='flex items-center gap-2'><FiUnlock /><span>Supprimer ce compte</span></span>, color: 'text-red-500'}}>
        <div className="my-5">
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Les données relatives à cet utilisateur seront définitivement supprimées.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Pour confirmer la suppression de ce compte, veuillez écrire l'adresse email de l'utilisateur (<span className='font-bold select-none'>{user.email}</span>) ci-dessous:
          </p>
          <div className="flex text-sm">
            <input type="email" value={confirmDeleteUserInputValue} onChange={(e) => setConfirmDeleteUserInputValue(e.target.value)} className="p-2 rounded-md border-[0.5px] border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 w-full dark:text-gray-50" id="deleteUserEmailInput" placeholder="example@example.com" />
          </div>
        </div>

        <div className="mt-4 flex text-sm justify-end">
          <Button variant={'danger'} onClick={onConfirmDeleteUser} disabled={!confirmDeleteUserInputValue || (confirmDeleteUserInputValue && confirmDeleteUserInputValue !== user.email) ? true : false}>
            Confirmer
          </Button>
        </div>
      </Modal>
    </>
  )
}