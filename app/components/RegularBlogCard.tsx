'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {userStore} from '../Zustand/zustand'

import { usePathname } from 'next/navigation'
import ConfirmationModal from './ConfirmationModal';
import EditBlogModal from './EditBlogModal';

const RegularBlogCard = ({blog}) => {

  const Server = process.env.NEXT_PUBLIC_SERVER
  const pathname = usePathname()
    console.log('pathname',pathname)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [dropDown, setDropDown] = useState<boolean>(false)
  const [writerDropDown, setWriterDropDown] = useState<boolean>(false)
  const [role, setRole] = useState<string | null>(null)

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
  const [openEditModal, setOpenEditModal] = useState<boolean>(false)

  const decoded = userStore((state) => state.fetchDecoded);
  const setStatus = userStore((state) => state.setStatus);


  const checkIsAdmin =  async () => {
    const decoded_data = await decoded()
    const role = decoded_data?.decoded.role
      setRole(role)
  }

  useEffect(() => {
    checkIsAdmin()
    window.onclick= function (){
      setDropDown(false)
      setWriterDropDown(false)
    }
  }, []);

  // console.log('width', window.innerWidth)

  let truncatedString;
  const words = blog?.description?.split(' ');

  if (words.length > 10) {
    
    const truncatedWords = words.slice(0, 10);
    truncatedString = `${truncatedWords.join(' ')}..........`;

  } 
  else {
    truncatedString = blog?.description
  }

  const dateObj = new Date(blog?.updatedAt);
  const formattedDate = dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleDropDown = (event:any) => {
    event.stopPropagation();
    setDropDown(!dropDown)
  }

  const handleWriterDropDown = (event:any) => {
    event.stopPropagation();
    setWriterDropDown(!writerDropDown)
  }

  const handleChangeStatus = async (status:string) => {
      setDropDown(false)
      const decoded_data = await decoded()
      const token = decoded_data.value
      const settings = {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({status: status})
    };
    console.log('settings', settings)
    // return 
    let res:any = await fetch(`${Server}/admin/blogStatus/${blog?._id}`, settings)
        if(res.ok){
          setStatus(status)
        }    
    res = await res.json()
        console.log('status res', res)

    // http://localhost:3002/admin/blogStatus/65b0aef0f997a771b4c99568
    // console.log(status)
  }

  const deleteModal = () => {
    setOpenDeleteModal(openDeleteModal => !openDeleteModal)
  }

  const closeDeleteModal = (value:boolean) => {
    setOpenDeleteModal(value)
  }
  
  const editModal = () => {
    setOpenEditModal(openEditModal => !openEditModal)
  }

  const closeEditModal = (value:boolean) => {
    setOpenEditModal(value)
  }



  return (
    <div className='flex justify-center '>
    
    <div className="relative flex h-[7.5rem] sm:h-[8.5rem] w-[27rem] md:w-[33rem] md:h-[10rem] lg:w-[32rem] border rounded-lg hover:shadow-md hover:transition mt-4 overflow-hidden">
      {/* <div className='font-bold text-2xl'>{numberOfWords}</div> */}
      <div className="flex gap-4  lg:gap-4 w-full">
      <div className='w-[35%]'>
      <Link href={'/articleDetails?id='+blog?._id}>
        <Image className='w-full h-full rounded-lg' src={blog?.images || '/rectangle.png'} width={250} height={250} alt="card-img" />
      </Link>
      </div>
      <div className='w-[45%] mt-2 md:mt-0'>
        <div className=" text-Gray font-sans text-xs font-medium M_L:text-sm lg:text-[0.9rem]">{blog?.category?.name}</div>
        <h1 className='text-sm sm:text-base   font-bold'>{blog?.title}</h1>
        <div className="flex text-Gray font-sans text-xs md:text-sm  gap-2 md:gap-4">
          <span className="">{blog?.user?.name}</span>
          <span className="hidden sm:flex text-Gray -mt-1 font-bold">.</span>
          <span className='hidden sm:flex'>{formattedDate}</span>
        </div>
        <p className={`${pathname === '/categories' ? 'lg:flex' : 'md:flex'} hidden  font-sans text-xs leading-5 mt-2`}>
          {/* {blog.description} */}
          {/* {words} */}
          {/* {description} */}
          {truncatedString}
        </p>
      </div>
      </div>


        {pathname === '/categories' ? null : 
        <div> 
        {role === 'admin' ?
        <div onClick={()=>handleDropDown(event)} className={`${blog?.status === 'unapproved' ? 'bg-red-500': 'bg-sky-400'} flex  py-1 px-1 cursor-pointer justify-between absolute right-0 top-0 border border-t-0 border-r-0 rounded-se-md rounded-bl-md shadow-md hover:shadow-none w-20 sm:w-24`}>  
        <span className='text-[0.6rem] md:text-xs text-white '>{blog?.status.charAt(0).toUpperCase() + blog?.status.slice(1)}</span>
          <Image 
          src={'/dropdown-btn.svg'}
          alt='drop-btn'
          width={200}
          height={200}
          className='w-4 h-4  '
         />
         </div>
         :
         null } 
         </div> 
         }

      {dropDown ===true ? 
         <div className='w-20 sm:w-24 absolute right-0 top-6  overflow-y-scroll  flex flex-col items-start pl-1 md:pl-0 md:items-center h-8 no-scrollbar text-[#858585] bg-white shadow-lg border'>
          <button className='hover:bg-green-500 hover:text-white text-xs' onClick={()=>handleChangeStatus('approved')}>Approve</button>
          <button className='hover:bg-red-500 hover:text-white text-xs' onClick={()=>handleChangeStatus('unapproved')}>UnApprove</button>
         </div>
         : null
        }
      



        {pathname === '/user/myBlogs' ? 
          <div> 
          {role === 'writer' ?
          <div onClick={()=>handleWriterDropDown(event)} className={`${blog?.status === 'unapproved' ? 'bg-red-500': 'bg-green-500'} flex  py-1 px-1 cursor-pointer justify-between absolute right-0 top-0 border border-t-0 border-r-0 rounded-se-md rounded-bl-md shadow-md hover:shadow-none w-24`}>  
          <span className='text-xs text-white '>{blog?.status.charAt(0).toUpperCase() + blog?.status.slice(1)}</span>
            <Image 
            src={'/dropdown-btn.svg'}
            alt='drop-btn'
            width={200}
            height={200}
            className='w-4 h-4  '
           />
           </div>
           :
           null } 
           </div>
        : 
        null
        }

      {writerDropDown ===true ? 
         <div className='absolute right-0 top-6  overflow-y-scroll  flex flex-col h-8 no-scrollbar w-24 text-[#858585] bg-white shadow-lg'>
          <button onClick={editModal} className='hover:bg-sky-400 hover:text-white text-xs' >Edit</button>
          <button onClick={deleteModal} className='hover:bg-[#FF5733] hover:text-white text-xs' >Delete</button>
         </div>
         : null
        }


        {openDeleteModal ? 
        <ConfirmationModal blogDetails={blog} closeDeleteModal={closeDeleteModal} /> 
        : null}


        {openEditModal ? 
        <EditBlogModal blogDetails={blog} closeEditModal={closeEditModal} /> 
        : null}

    </div>
    </div>
  );
};

export default RegularBlogCard;
