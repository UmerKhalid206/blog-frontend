'use client'
import React, { useEffect, useState } from 'react'
import Search from '../components/Search'
import CategoryBtn from '../components/CategoryBtn'
import {userStore} from '../Zustand/zustand'
import RegularBlogCard from '../components/RegularBlogCard'
import toast, { Toaster } from 'react-hot-toast'

const Page = () => {

    const [categories, setCategories] = useState<any>([])
    const [blogs, setBlogs] = useState<any>([])
    const categoryId = userStore((state) => state.categoryId);

    const Server = process.env.NEXT_PUBLIC_SERVER
    const fetchCategories = async() =>{
        let res = await fetch(`${Server}/categories`)
        res = await res.json()
        setCategories(res)
        console.log(res)
      }

      // if(categoryId){
          console.log('from zus',categoryId)
          const fetchCategorisedData = async() =>{
            if(categoryId){
              let res:any = await fetch(`${Server}/blogs/categorySpecific/${categoryId}`)
              // console.log('response of search',res)
              res = await res.json()
              if(!res.length){
                toast.error('No data found', {position: 'top-center'})
              }
              setBlogs(res)
              console.log("category res",res)
            }
            }
      // }

    useEffect(() => {
        fetchCategories()
        fetchCategorisedData()
    }, [categoryId])
    const getIdHandle = (id:string) => {

    };

  return (
    <div className='mb-12'>
        <div className='flex justify-center items-end h-[10vh]'>
        <Search />
        </div>
        <div className='flex flex-wrap justify-center mt-8'>
            <div className='flex flex-wrap justify-center md:justify-center w-[80%] gap-2 lg:gap-4'>
        {categories?.map((category:any) => (
            <div className='' key={category?._id}>
            <CategoryBtn getId={categoryId} id={category?._id} name={category?.name}/>
        </div>
      ))}
      </div>
        </div>

        {categoryId ? 
        <div className='grid grid-cols-1 md:grid-cols-2 justify-center  mt-4'>
        {blogs.length ? blogs?.map((blog:any) => (
        <div className='flex justify-center' key={blog?._id}>
      <RegularBlogCard blog={blog}/>
        </div>
      ))
        :
        null
    }
        </div>
        : null}
    </div>
  )
}

export default Page