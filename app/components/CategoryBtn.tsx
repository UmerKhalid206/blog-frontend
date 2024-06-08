// 'use client'
import React, { useState } from 'react'
import {userStore} from '../Zustand/zustand'


const CategoryBtn = ({name, id, getId}) => {

  const [selected, setSelected] = useState<string>('')

  // useEffect(() => {

  // }, [])
  console.log("test ", id, selected)
    const categoryId = userStore((state) => state.setCategoryId);

    const handleCategorySearch = () => {
      setSelected('')
        categoryId(id)
        setSelected(id)
    }
  return (
    
    <button onClick={handleCategorySearch} className={`${selected === getId ? 'bg-black text-white' : 'bg-white text-black'} px-2 py-1 lg:py-2 lg:px-5 border border-black font-Baskervville rounded-3xl text-xs lg:text-sm hover:bg-black hover:text-white hover:scale-[0.96] transition duration-300 `}>#{name}</button>
    
  )
}

export default CategoryBtn