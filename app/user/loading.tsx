'use client'
import Image from 'next/image'
import React from 'react'
import {GridLoader} from "react-spinners";
const Loading = () => {
  return (
    <div className='text-5xl flex h-screen justify-center items-center'>
      
      <GridLoader color="#000000" size={20}/>
    </div>
  )
}

export default Loading