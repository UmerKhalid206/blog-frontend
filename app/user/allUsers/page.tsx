'use client'

import Blog_Card from '@/app/components/Blog_Card'
import React, { useEffect, useState } from 'react'
import {userStore} from '../../Zustand/zustand'
import RegularBlogCard from '@/app/components/RegularBlogCard'
import { FadeLoader } from 'react-spinners'
import RegularUserCard from '@/app/components/User_Card'

// interface PageLimitProps {
//   pagelimit?: number;
//   blogs: any[];
// }

const Page = () => {

  const [allUsers, setAllUsers] = useState<any>([])
  const [btn, setBtn] = useState<string>('all')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const decoded = userStore((state) => state.fetchDecoded);
  const newStatus = userStore((state) => state.newStatus);
  const Server = process.env.NEXT_PUBLIC_SERVER
  
  let btnStyle = ' hover:text-white rounded-full text-sm px-4 sm:px-8 py-[0.2rem]'
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
    let res = await fetch(`${Server}/admin/users`, settings)
    res = await res?.json()
    setAllUsers(res)
    console.log("users", res)
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
    let res = await fetch(`${Server}/admin/all?status=${status}`, settings)
    if(res.ok){
      res = await res?.json()
      setAllUsers(res)
      setIsLoading(false)
      console.log(status, '<==>', res)
    }
  
}

const usersPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = allUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allUsers.length / usersPerPage);
  const handlePageChange = (page:any) => {
    setCurrentPage(page);
  };
  return (
    <>
    
      <h1 className='text-center text-xl md:text-2xl py-4 font-Baskervville bg-black text-white '>Users Section</h1>
    <div className='relative flex flex-col items-center min-h-[100vh] w-full pb-10 overflow-x-hidden'>
      <div className='container lg:mx-auto mb-8 flex flex-col items-center lg:mr-2'>
      <div className='flex gap-4 sm:gap-6 md:gap-16  sm:px-4 py-4 bg-white'>
        <button onClick={handleAll} className={`${btnStyle} ${btn === 'all' ? 'bg-black text-white ml-8' : 'ml-8'} hover:bg-black`}>All</button>
        <button onClick={() => handleChangeStatus('unblocked')} className={`${btnStyle} ${btn === 'unblocked' ? 'bg-green-500 text-white ml-4' : 'ml-4'} hover:bg-green-500`}>UnBlocked</button>
        <button onClick={() => handleChangeStatus('blocked')} className={`${btnStyle} ${btn === 'blocked' ? 'bg-red-500 text-white' : ''} hover:bg-red-500`}>Blocked</button>
      </div>
      {isLoading === false ? 
      <div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-2 mx-2 lg:mx-2'>
      {currentUsers.length ? currentUsers?.map((user:any) => (
        <div  key={user?._id}>
      {/* <RegularBlogCard blog={blog}/> */}
      <RegularUserCard user={user}/>
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
     <div className="absolute bottom-0 md:bottom-2 xl:bottom-16 left-[40%] sm:left-[47.5%] pagination flex py-4 justify-center mt-8 lg:mt-4 sm:-ml-4">
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
    </>
  )
}

export default Page