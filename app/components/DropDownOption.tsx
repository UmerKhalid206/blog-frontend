'use client'
import React from 'react'
import {userStore} from '../Zustand/zustand'


const DropDownOption = ({data}) => {

    
    const setcategoryId = userStore((state) => state.setcategoryIdForBlog);

    const handleAddCategory =(event)=>{
        event.stopPropagation()

        console.log(data)
        setcategoryId(data)
    }

    // window.onclick
  return (
    <button onClick={handleAddCategory} className='w-full hover:text-[#858585] hover:bg-[#eee]'>
        #{data?.name}
    </button>
  )
}

export default DropDownOption