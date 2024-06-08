'use client'
import React, { useEffect, useState } from 'react'
import Blog_Card from './Blog_Card'
import { GridLoader } from 'react-spinners'

const Editor_pick = () => {

  const [allBlogs, setAllBlogs] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const Server = process.env.NEXT_PUBLIC_SERVER
  // console.log(Server)
  const fetchData = async() =>{
    setIsLoading(true)
    let res = await fetch(`${Server}/blogs/all`)
    if(res.ok){
      res = await res.json()
      setAllBlogs(res)
      setIsLoading(false)
      console.log("editor pick",res)
    }
  }

  useEffect(()=>{
    fetchData();
  }, [])


  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBlogs = allBlogs.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allBlogs.length / itemsPerPage);
  const handlePageChange = (page:any) => {
    setCurrentPage(page);
  };

  return (
    <>
    <div className="mt-12">
    <div className='flex flex-col items-center'>
      <h1 className='text-2xl font-bold text-center'>Editor&#39;s Picks</h1>
      <hr className=' h-[0.2rem] bg-black w-28 mt-2'/>
        {isLoading === false ? 
      <div className='relative flex flex-col items-center'>
      {currentBlogs?.map((blog:any) => (
        <div key={blog?._id}>
      <Blog_Card blog={blog}/>
        </div>
      ))}
      
      <div className="left-[40%] sm:left-[47.5%] pagination flex py-4 justify-center lg:mt-4 sm:-ml-4">
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
      :
      <div className='text-5xl flex h-screen justify-center items-center'>
      <GridLoader color="#000000" size={20}/>
    </div>
    }
    </div>
      
      
    </div>
    </>
  )
}

export default Editor_pick