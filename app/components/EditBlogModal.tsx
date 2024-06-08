import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import {userStore} from '../Zustand/zustand'
import toast from 'react-hot-toast';
import Image from 'next/image';

const Server = process.env.NEXT_PUBLIC_SERVER

export default function EditBlogModal({closeEditModal, blogDetails}) {

console.log('blogDetails', blogDetails)
const decoded = userStore((state) => state.fetchDecoded);
const refreshData = userStore((state) => state.refreshData);
const [updating, setUpdating] = useState<boolean>(false) 

let [isOpen, setIsOpen] = useState(true)
const [title, setTitle] = useState<string>(blogDetails?.title)
const [description, setDescription] = useState<string>(blogDetails?.description)
const [isHovered, setHovered] = useState<boolean>(false);
const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>();
const [imageFile, setImageFile] = useState<any>();

  function closeModal() {
    // setIsOpen(false)
    closeEditModal(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const confirmUpdate = async() => {
    console.log('imageFile', imageFile)
    console.log('description', description)
    
    // return
    setUpdating(true)
    const decoded_data = await decoded()
    const token = decoded_data.value
    const data = new FormData();
    if(imageFile){
      data.append('file', imageFile);
      if(blogDetails?.images){
        data.append('images', blogDetails?.images)
      }
    }
    if(description !== blogDetails?.description){
      data.append('description', description)
    }
    const settings = {
      method: "PUT",
      headers: {
          // 'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
      },
      body: data,
      
  };
  let res:any = await fetch(`${Server}/blogs/${blogDetails._id}` , settings)
      if(res.ok){
        refreshData(true)
        setUpdating(false)
        toast.success('Blog Updated Successfully')
       closeModal()
      }else{
          res = await res.json()
          toast.error(res?.message, {position:'top-center'})
          setUpdating(false)
      } 
      setUpdating(false)   
  }


  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    const minSize = 100 * 1024;
      if (file.size < minSize) {
        // alert('Please select an image with a minimum size of 400 KB.');
        toast.error('Select image of atleast 100 KB', {position: 'top-center'})
        return;
      }

    const reader = new FileReader();
    if (file) {

      const fileType = file.type;
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

      if (allowedTypes.includes(fileType)) {

        reader.onloadend = () => {
          setImagePreview(reader.result);
        };

        reader.readAsDataURL(file);
        setImageFile(file)
      } else {
        toast.error('Please upload a .png, .jpg, or .jpeg file.',{position: 'top-center'})
        event.target.value = null;
      }
    }
  };

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
                <Dialog.Panel className="w-[40rem] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-center text-2xl font-semibold leading-6"
                  >
                    Edit Blog
                  </Dialog.Title>

                  <hr className='my-4'/>
                  <div 
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className= 'relative flex flex-col bg-[#eee] gap-2 items-center mt-2 rounded-lg h-[12rem] max-w-full'>
                  <div 
                  className='relative h-full w-full'>
                    {imagePreview ? 
                    <Image
                      src={imagePreview}
                      alt='Blog pic'
                      width={500}
                      height={500}
                      className={`h-full w-full rounded-lg ${isHovered ? 'opacity-40 ' : ''}`}
                    />
                    :
                    <Image
                    src={blogDetails?.images}
                    alt='Blog pic'
                    width={500}
                    height={500}
                    className={`h-full w-full rounded-lg ${isHovered ? 'opacity-40' : ''}`}
                    />
                  }

              {/* <Image 
              src={blogDetails?.images}
              alt='blog image'
              width={500}
              height={500}
              className='h-full w-full rounded-lg'
              /> */}
              
              {/* {isUploading === true ? 
              <div className='absolute bottom-4 right-4 '>
              <Spinner />
              </div>
              : 
              <button onClick={handleDeleteImage} className='absolute bottom-4 right-4 text-red-500 px-2 py-2  rounded-full bg-white hover:bg-red-500 hover:text-white'><BsTrash /></button>
            } */}
              
              </div>

              {isHovered && (
                      <label className=" rounded-lg absolute inset-0  z-50 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1  ">
                        
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-8 h-8">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                        <input onChange={handleFileChange} type="file" accept=".png, .jpg, .jpeg" className="hidden"/>
                        
                      
                      </label>
                    )}

                  </div>
              <div className='flex bg-[#eee] p-2 gap-2 items-center mt-2 rounded-lg w-full'>
             <input value={title} disabled onChange={(e)=>setTitle(e.target.value)} type="text" placeholder='Title' className='cursor-no-drop text-gray-400/80 placeholder:text-gray-400/80 pl-2 w-[95%] overflow-hidden outline-none bg-transparent  placeholder:text-sm pt-1'/>
             </div>

              <div className='flex bg-[#eee] p-2 gap-2 items-center mt-2 rounded-lg w-full'>
              <input value={blogDetails?.category?.name} disabled  type="text" placeholder='Category' className='cursor-no-drop text-gray-400/80 placeholder:text-gray-400/80 pl-2 w-[95%] overflow-hidden outline-none bg-transparent  placeholder:text-sm pt-1'/>
             </div>

              <div className='flex bg-[#eee] p-2 gap-2 items-center mt-2 rounded-lg w-full'>
              <textarea defaultValue={description} onChange={(e)=>setDescription(e.target.value)} placeholder='Description' className='pl-2 w-[100%] overflow-hidden outline-none bg-transparent text-[#858585] placeholder:text-[#858585] placeholder:text-sm pt-1'/>
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
                    disabled={updating}
                      type="button"
                      className={`${updating === true ? 'cursor-no-drop bg-gray-300 text-gray-400' : 'bg-blue-500 text-white hover:scale-105 hover:bg-white hover:text-blue-500 border border-blue-500'} flex text-end mt-2 py-1 px-2 rounded-md   text-sm  transition duration-300 `}
                      onClick={confirmUpdate}
                    >
                      {updating===true ? 'Updating' : 'Update'}
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
