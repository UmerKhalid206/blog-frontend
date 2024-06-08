import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import {userStore} from '../Zustand/zustand'
import toast from 'react-hot-toast';

const Server = process.env.NEXT_PUBLIC_SERVER

export default function ConfirmationModal({closeDeleteModal, blogDetails}) {


const decoded = userStore((state) => state.fetchDecoded);
const refreshData = userStore((state) => state.refreshData);
const [deleting, setDeleting] = useState<boolean>(false) 

let [isOpen, setIsOpen] = useState(true)

  function closeModal() {
    // setIsOpen(false)
    closeDeleteModal(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const confirmDelete = async() => {
    setDeleting(true)
    const decoded_data = await decoded()
    const token = decoded_data.value
    const settings = {
      method: "DELETE",
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
      },
      
  };
  let res:any = await fetch(`${Server}/blogs/${blogDetails._id}` , settings)
      if(res.ok){
        refreshData(true)
        setDeleting(false)
        toast.success('Blog Deleted Successfully')
       closeModal()
      }else{
          res = await res.json()
          toast.error(res?.message, {position:'top-center'})
          setDeleting(false)
      } 
      setDeleting(false)   
  }

  return (
    <>
      {/* <div className="fixed inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
          Open dialog
        </button>
      </div> */}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-red-500"
                  >
                    Confirm Deletion Operation
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Do you really want to delete this blog <br /> 
                      <span className='text-lg font-bold'>
                      {blogDetails?.title}
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-2 justify-end mt-4">
                    <button
                      type="button"
                      className='flex text-end mt-2 border py-1 px-2 rounded-md bg-[#e4e6eb] text-[#62666d] text-sm hover:text-black hover:scale-95 transition duration-300'
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                    disabled={deleting}
                      type="button"
                      className={`${deleting === true ? 'cursor-no-drop bg-gray-300 text-gray-400' : 'bg-red-500 text-white hover:scale-105 hover:bg-white hover:text-red-500 border border-red-500'} flex text-end mt-2 py-1 px-2 rounded-md   text-sm  transition duration-300 `}
                      onClick={confirmDelete}
                    >
                      {deleting===true ? 'Deleting' : 'Delete'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
