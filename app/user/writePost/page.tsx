'use client'
import DropDownOption from '@/app/components/DropDownOption'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Spinner from "@/app/components/Spinner";
import {userStore} from '../../Zustand/zustand'
import { BsTrash } from "react-icons/bs";
import {toast} from 'react-hot-toast'
import {useRouter} from "next/navigation";

const Page = () => {

  const router = useRouter();

  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [dropDown, setDropDown] = useState<boolean>(false)
  const [categories, setCategories] = useState<any>([])
  const [role, setRole] = useState<any>(null)
  const [BtnDisable, setBtnDisable] = useState(false);

  const [selectedFile, setSelectedFile] = useState<any>()
  const [selectedCategory, setSelectedCategory] = useState<any>()
  const [title, setTitle] = useState<string>()
  const [description, setDescription] = useState<string>()

  const categoryId = userStore((state) => state.categoryIdForBlog);
  const decoded = userStore((state) => state.fetchDecoded);
  
  const Server = process.env.NEXT_PUBLIC_SERVER

  const fetchCategories = async() =>{

        const decoded_data = await decoded()
        setRole(decoded_data.decoded.role)
        let res:any = await fetch(`${Server}/categories`)
        res = await res.json()
        setCategories(res)
        console.log("u data",res)
    }
  

  useEffect(() => {
    fetchCategories()
    
    window.onclick= function (){
      setDropDown(false)
    }
  }, [])

  const handleDropDown = (event:any) => {
    event.stopPropagation();
    setDropDown(!dropDown)

  }
  
  const handleSelectCategory =(category:any) => {
    console.log('selected category', category)
    setSelectedCategory(category)
  }

  // const showId = () => {
  //   console.log("from zus id",categoryId)
  // }
  

  const checkFileSize = async (event:any) => {
    const file = event.target.files[0];
    const decoded_data = await decoded()
    // Check if a file is selected
    if (file) {
      // Check the file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (PNG, JPG, JPEG).')
        return;
      }

      // Check the file size (minimum size: 400 KB)
      const minSize = 100 * 1024;
      if (file.size < minSize) {
        // alert('Please select an image with a minimum size of 400 KB.');
        toast.error('Select image of atleast 100 KB', {position: 'top-right'})
        return;
      }else{
        setIsUploading(true)
        const data = new FormData();
        data.append('file', file);
        const token = decoded_data.value
            const settings = {
                method: "POST",
                headers: {
                    // 'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: data 
            };
            console.log('settings',settings )
            // return
            let res:any = await fetch(`${Server}/cloudinary/newImage`, settings)
            // .then((result) => {
            //   if(result?.ok){
            //     console.log(result)
            //   setSelectedFile(result);
            //   setIsUploading(false)
            //   }
            // })
            if(res.ok){
              res = await res?.json()
              console.log(res)
              setSelectedFile(res)
              setIsUploading(false)
            }
          }
      }
      console.log('selected file', selectedFile)

      // Set the selected file in the state

    // }
  };

 const handleDeleteImage = async () => {
  setIsUploading(true)
  console.log('selected file', selectedFile?.secure_url)
  // return 
  const decoded_data = await decoded()
  const token = decoded_data.value
  
  const settings = {
    method: "DELETE",
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    },
    body:JSON.stringify({image_url: selectedFile?.secure_url})  
};

console.log('settings',settings )
// return
  let res:any = await fetch(`${Server}/cloudinary`, settings)
  .then((result:any) => {
    if(result?.ok){
      setSelectedFile(null)
      console.log('after deleting',result)
      setIsUploading(false)
    }
  })

 }


 const submitBlog = async() => {
  setBtnDisable(true)
  console.log('title', title)
  console.log('description', description)
  console.log('category', selectedCategory?._id)
  console.log('image', selectedFile?.secure_url)

  // return
  const decoded_data = await decoded()
  const token = decoded_data.value
  
  const settings = {
    method: "POST",
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    },
    body:JSON.stringify({
      title: title,
      description: description,
      images: selectedFile?.secure_url,
      category: selectedCategory?._id
    })  
};

let res:any = await fetch(`${Server}/blogs/new`, settings)
if(!res.ok){
  console.log('after uploading',res)
  res = await res?.json()
  toast.error(res?.error)
  setBtnDisable(false)
}else{
  toast.success('Blog uploaded successfully', {position: 'top-right'})
    setBtnDisable(false)
    router.push('/')
}
console.log('after uploading',res)
// .then((result:any) => {
//   if(result?.ok){
//     setSelectedFile(null)
//     console.log('after uploading',result)
//     setIsUploading(false)
//     toast.success('Blog uploaded successfully', {position: 'top-right'})
//     setBtnDisable(false)
//   }
// })

 }

  if(role === 'writer'){
  return (
    <div className='flex flex-col items-center bg-[#eee] min-h-[100vh]'>
      <div className=' py-5 mt-4 pb-8 bg-white w-[45rem] rounded-lg shadow-md'>
      <h1 className='text-center font-Baskervville text-2xl pb-5 ' >Create a Post</h1>
      <hr className=''/>
      <div className='mt-6 flex flex-col items-center'>

   
      <div className={`${selectedFile?.url ? 'p-0' : 'p-2'} flex bg-[#eee] gap-2 justify-center items-center mt-2 rounded-lg h-[10rem] w-[70%]`}>
          
            {selectedFile?.secure_url ?
               <div className='relative h-full w-full'>
              <Image 
              src={selectedFile?.secure_url}
              alt='blog image'
              width={500}
              height={500}
              className='h-full w-full rounded-lg'
              />
              
              {isUploading === true ? 
              <div className='absolute bottom-4 right-4 '>
              <Spinner />
              </div>
              : 
              <button onClick={handleDeleteImage} className='absolute bottom-4 right-4 text-red-500 px-2 py-2  rounded-full bg-white hover:bg-red-500 hover:text-white'><BsTrash /></button>
            }
              
              </div>
             
          : 
          <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-[#858585]  ">
            {isUploading === true ? 
            <div className="h-24 flex items-center">
            <Spinner />
            </div>
            :
            <div className='flex flex-col items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <div>
              Add image
            </div>
            <input type="file" onChange={checkFileSize} accept=".png, .jpg, .jpeg" className="hidden"/>
            </div>
          }
          </label>
          }
      </div>



      <div className='flex bg-[#eee] p-2 gap-2 items-center mt-2 rounded-lg w-[70%]'>
          <input onChange={(e)=>setTitle(e.target.value)} type="text" placeholder='Title' className='pl-2 w-[95%] overflow-hidden outline-none bg-transparent text-[#858585] placeholder:text-[#858585] placeholder:text-sm pt-1'/>
      </div>


      <div onClick={()=>handleDropDown(event)} className='relative cursor-pointer flex justify-between bg-[#eee]  gap-2 items-center mt-2 rounded-lg w-[70%] pr-2'>
         {/* <label htmlFor="category" className='text-[#858585] py-3 pl-4 text-sm'>{categoryId?.name || 'Category'}</label> */}
         <input className='text-[#858585] py-3 pl-4 text-sm placeholder:text-[#858585] w-[40%]' type="text" value={`#${selectedCategory ? selectedCategory?.name : 'Category'}`} placeholder='Category' disabled/>
         <button>
          <Image 
          src={'/dropdown-btn.svg'}
          alt='drop-btn'
          width={200}
          height={200}
          className='w-4 h-4 text-gray-400'
         />
         </button>
      </div>
      {dropDown ===true ? 
         <div className='absolute mt-[16.5rem] rounded-lg overflow-y-scroll  flex flex-col  h-12 no-scrollbar w-[31.5rem] text-[#858585] bg-white shadow-lg border'>
         {categories?.map((category:any) => (
          <button className='hover:bg-black hover:text-white' onClick={()=>handleSelectCategory(category)} key={category?._id}>{category?.name}</button>
        //     <div  className='' key={category?._id}>
            // <DropDownOption data={category}/>
        // </div>
      ))}
         </div>
         : null
        }
      

      <div className='flex bg-[#eee] p-2 gap-2 items-center mt-2 rounded-lg w-[70%]'>
          <textarea onChange={(e)=>setDescription(e.target.value)} placeholder='Description' className='pl-2 w-[100%] overflow-hidden outline-none bg-transparent text-[#858585] placeholder:text-[#858585] placeholder:text-sm pt-1'/>
      </div>

      <div className='w-[70%] flex justify-end'>
        <button  onClick={submitBlog} disabled={BtnDisable} className={`${BtnDisable === true ? 'cursor-no-drop' : ''} hover:bg-black mt-4 hover:text-white border-[1px] border-[#858585] text-center py-2 px-8 rounded-lg font-medium text-black text-sm`}>Post</button>
      </div>
      </div>
      </div>
    </div>
  )
}
}

export default Page