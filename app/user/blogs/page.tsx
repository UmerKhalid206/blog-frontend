'use client'

import Blog_Card from '@/app/components/Blog_Card'
import React, { useEffect, useState } from 'react'
import {userStore} from '../../Zustand/zustand'
import RegularBlogCard from '@/app/components/RegularBlogCard'
import { FadeLoader } from 'react-spinners'
import SideDrawer from '@/app/components/SideDrawer'

interface PageLimitProps {
  pagelimit?: number;
  blogs: any[];
}

const Page = () => {

  const [allBlogs, setAllBlogs] = useState<any>([])
  const [btn, setBtn] = useState<string>('all')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const decoded = userStore((state) => state.fetchDecoded);
  const newStatus = userStore((state) => state.newStatus);
  const Server = process.env.NEXT_PUBLIC_SERVER
  
  let btnStyle = 'hover:bg-black hover:text-white rounded-full text-sm px-8 py-[0.2rem]'
  // console.log(Server)


  // use this in zustand to avoid page change of all, unapproved etc
  const fetchData = async() =>{
    setIsLoading(true)
    const decoded_data = await decoded()
    const token = decoded_data.value
    const settings = {
      method: "GET",
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
      } 
  };
    let res = await fetch(`${Server}/blogs`, settings)
    res = await res?.json()
    setAllBlogs(res)
    console.log(res)
    setBtn('all')
    setIsLoading(false)
  }

  useEffect(()=>{
    fetchData();
  }, [newStatus])

const handleAll = () => {
  setBtn('all')
  fetchData();
}

const handleChangeStatus = async(status:any) => {
  setBtn(status)
  setIsLoading(true)
    const decoded_data = await decoded()
    const token = decoded_data.value
    const settings = {
      method: "GET",
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
      } 
  };
    let res = await fetch(`${Server}/blogs?status=${status}`, settings)
    if(res.ok){
      res = await res?.json()
      setAllBlogs(res)
      setIsLoading(false)
      console.log(status, '<==>', res)
    }
  
}

const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBlogs = allBlogs.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allBlogs.length / itemsPerPage);
  const handlePageChange = (page:any) => {
    setCurrentPage(page);
  };
  return (
    <div className='relative flex flex-col min-h-[100vh] w-full pb-10'>
      <div className='text-center text-xl md:text-2xl py-4 font-Baskervville bg-black text-white '>
      <div className='md:hidden absolute top-3 left-2'>
          <SideDrawer />
        </div>
        Blogs Section
        </div>
      <div className='container mx-auto mb-8 flex flex-col items-center'>
      <div className=' flex sm:gap-8 md:gap-16  sm:px-6 py-4 bg-white'>
        <button onClick={handleAll} className={`${btnStyle} ${btn === 'all' ? 'bg-black text-white ml-8 text-xs sm:text-base' : 'ml-8'}`}>All</button>
        <button onClick={() => handleChangeStatus('approved')} className={`${btnStyle} ${btn === 'approved' ? 'bg-black text-white ml-4 text-xs sm:text-base' : 'ml-4'}`}>Approved</button>
        <button onClick={() => handleChangeStatus('unapproved')} className={`${btnStyle} ${btn === 'unapproved' ? 'bg-black text-white text-xs sm:text-base' : ''}`}>UnApproved</button>
      </div>
      {isLoading === false ? 
      <div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-2 mx-2 sm:mx-0'>
      {currentBlogs.length ? currentBlogs?.map((blog:any) => (
        <div key={blog?._id}>
      <RegularBlogCard blog={blog}/>
        </div>
      ))
        :
        <div className='absolute top-[50%] left-[50%] md:left-[44%]'>
          No Data found
        </div>
    }
      </div>
      : 
      <div className='flex flex-col justify-center items-center mt-4 h-[50vh]'>
      <FadeLoader color="#000000" />
      </div>
   }

    </div>
     {/* Pagination */}
     <div className="absolute bottom-0 left-[40%] sm:left-[47.5%] pagination flex py-4 justify-center mt-8 lg:mt-4 sm:-ml-4">
      <div className='flex gap-4'>
          <div className="goBack ">
          <button
            className="join-item btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            «
          </button>
          </div>
          <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`join-item btn ${currentPage === i + 1 ? 'active bg-black text-white px-2 py-[0.15rem] rounded-md' : ''}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          </div>
          <div className="goForward ">
          <button
            className="join-item btn cursor-pointer"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            »
          </button>
          </div>
        </div>
        </div>
    </div>


//   <div className='relative flex flex-col min-h-screen w-full'>
//   <h1 className='text-center text-2xl py-4 font-Baskervville bg-black text-white '>Blogs Section</h1>
//   <div className='container mx-auto'>
//     <div className='flex flex-col lg:flex-row gap-2 lg:gap-16 justify-center items-center px-4 lg:px-6 w-full py-4 bg-white'>
//       <button onClick={handleAll} className={`${btnStyle} ${btn === 'all' ? 'bg-black text-white mb-2 lg:mb-0' : 'mb-2 lg:mb-0'}`}>All</button>
//       <button onClick={() => handleChangeStatus('approved')} className={`${btnStyle} ${btn === 'approved' ? 'bg-black text-white mb-2 lg:mb-0' : 'mb-2 lg:mb-0'}`}>Approved</button>
//       <button onClick={() => handleChangeStatus('unapproved')} className={`${btnStyle} ${btn === 'unapproved' ? 'bg-black text-white' : ''}`}>UnApproved</button>
//     </div>
//     {isLoading === false ? 
//       <div className='grid grid-cols-1 lg:grid-cols-2'>
//         {currentBlogs.length ? currentBlogs?.map((blog:any) => (
//           <div key={blog?._id} className="mb-4 lg:mb-0">
//             <RegularBlogCard blog={blog}/>
//           </div>
//         )) :
//         <div className='flex justify-center items-center mt-4'>
//           No Data found
//         </div>
//       }
//     </div>
//     : 
//     <div className='flex flex-col justify-center items-center mt-4 h-[50vh]'>
//       <FadeLoader color="#000000" />
//     </div>
//   }

//   {/* Pagination */}
//   <div className="flex justify-center mt-4">
//     <div className='flex gap-4'>
//       <div className="goBack ">
//         <button
//           className="join-item btn"
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//         >
//           «
//         </button>
//       </div>
//       <div className="flex gap-2">
//         {Array.from({ length: totalPages }, (_, i) => (
//           <button
//             key={i}
//             className={`join-item btn ${currentPage === i + 1 ? 'active bg-black text-white px-2 py-[0.15rem] rounded-md' : ''}`}
//             onClick={() => handlePageChange(i + 1)}
//           >
//             {i + 1}
//           </button>
//         ))}
//       </div>
//       <div className="goForward ">
//         <button
//           className="join-item btn cursor-pointer"
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//         >
//           »
//         </button>
//       </div>
//     </div>
//   </div>
// </div>
// </div>


  )
}

export default Page