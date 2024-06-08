'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {userStore} from '../Zustand/zustand'



const RegularUserCard = ({user}) => {

    console.log("mein ho user", user)
  const Server = process.env.NEXT_PUBLIC_SERVER
    
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [dropDown, setDropDown] = useState<boolean>(false)

  const decoded = userStore((state) => state.fetchDecoded);
  const setStatus = userStore((state) => state.setStatus);


  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    // console.log(windowWidth)
  };

  useEffect(() => {

    window.onclick= function (){
      setDropDown(false)
    }
  }, []);

  // console.log('width', window.innerWidth)

//   let truncatedString;
//   const words = blog?.description?.split(' ');

//   if (words.length > 10) {
    
//     const truncatedWords = words.slice(0, 10);
//     truncatedString = `${truncatedWords.join(' ')}..........`;

//   } 
//   else {
//     truncatedString = blog?.description
//   }

//   const dateObj = new Date(blog?.updatedAt);
//   const formattedDate = dateObj.toLocaleDateString(undefined, {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   });

  const handleDropDown = (event:any) => {
    event.stopPropagation();
    setDropDown(!dropDown)

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
  let res:any = await fetch(`${Server}/admin/userStatus/${user?._id}`, settings)
      if(res.ok){
        setStatus(status)
      }    
      res = await res.json()
      console.log('status res', res)

    // http://localhost:3002/admin/blogStatus/65b0aef0f997a771b4c99568
    console.log(status)
  }

  return (
    <div className='flex justify-center '>
    <div className="relative flex h-[7.5rem] sm:h-[8.5rem] w-[27rem] md:w-[33rem] md:h-[10rem] lg:w-[32rem] border rounded-lg hover:shadow-md hover:transition mt-4 overflow-hidden">
      {/* <div className='font-bold text-2xl'>{numberOfWords}</div> */}
      <div className="flex gap-4  lg:gap-4 w-full">
      <div className='w-[30%] flex justify-center items-center'>
      <Link className=' border-red-500' href={''}>
        <Image className='ml-1 sm:ml-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full hover:scale-[1.02] transition' src={user?.image_url || '/Profile_Picture.png'} width={280} height={250} alt="card-img" />
      </Link>
      </div>
      <div className='w-[45%] pt-8'>
        {/* <div className="text-Gray font-sans text-xs font-medium M_L:text-sm lg:text-[0.9rem]">{}</div> */}
        <h1 className='text-sm sm:text-lg   font-bold'>{user?.name}</h1>
        {/* <div className="flex text-Gray font-sans text-xs md:text-sm  gap-2 md:gap-4">
          <span className="">{}</span>
          <span className="hidden sm:flex text-Gray -mt-1 font-bold">.</span>
          <span className='hidden sm:flex'>{}</span>
        </div> */}
        <h2 className='text-sm sm:text-xs text-Gray -mt-1 ml-1'>{user?.email}</h2>
        <button className={`${user?.role === 'writer' ? 'bg-[#9c27b0]' : 'bg-[#2e7d32]'} sm:flex font-sans text-xs leading-5 mt-6  px-3 pt-[0.03rem] pb-[0.1rem] rounded-md text-white`}>
            {user?.role}
          {/* {blog.description} */}
          {/* {words} */}
          {/* {description} */}
          {/* {truncatedString} */}
        </button>
      </div>
      </div>


        {/* approve unapprove */}
        <div onClick={()=>handleDropDown(event)} className={`${user?.status === 'blocked' ? 'bg-red-500': 'bg-sky-400'} flex  py-1 px-1 cursor-pointer absolute right-0 top-0 border border-t-0 border-r-0 rounded-se-md rounded-bl-md shadow-md hover:shadow-none w-24`}>
            {/* <input type="text" placeholder='unapprove' value={'unapprove'} className='outline-none w-[70%] pl-2 text-xs py-1' disabled/> */}
         <button className={`bg-transparent flex justify-between ${user?.status === 'blocked' ? 'gap-6' : 'gap-3'}`} >
        <span className='text-xs text-white '>{user?.status.charAt(0).toUpperCase() + user?.status.slice(1)}</span>
          <Image 
          src={'/dropdown-btn.svg'}
          alt='drop-btn'
          width={200}
          height={200}
          className='w-4 h-4'
         />
         </button>
         </div>

      {dropDown ===true ? 
         <div className='absolute right-0 top-6  overflow-y-scroll  flex flex-col h-8 no-scrollbar w-24 text-[#858585] bg-white shadow-lg border'>
          <button className='hover:bg-green-500 hover:text-white text-xs' onClick={()=>handleChangeStatus('unblocked')}>UnBlock</button>
          <button className='hover:bg-red-500 hover:text-white text-xs' onClick={()=>handleChangeStatus('blocked')}>Block</button>
         </div>
         : null
        }

    </div>
    </div>
  );
};

export default RegularUserCard;
