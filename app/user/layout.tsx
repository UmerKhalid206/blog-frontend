'use client'
import React, { useEffect, useState } from 'react'
import SideNav from '../components/SideNav'
import {userStore} from '../Zustand/zustand'
import SideDrawer from '../components/SideDrawer'
const Layout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {

    const decoded = userStore((state) => state.fetchDecoded);
    const [role, setRole] = useState<any>(null)
    
    const fetchData = async() =>{
      const decoded_data = await decoded()
      if(decoded_data){
          // setRole(decoded_data.decoded.role)
          console.log('role',decoded_data.decoded.role)
          setRole(decoded_data.decoded.role)
          const token = decoded_data
      }
    }

    useEffect(() => {
      fetchData()
    }, [])

    if(role === 'writer' || role === 'admin'){

    
  return (
    <div className='flex '>
        <div className='hidden min-h-[100vh] md:block w-[12rem]'>
    <SideNav show={true}/>
        </div>
        {/* <h1>abc</h1> */}
        <div className='md:hidden min-h-[100vh] absolute top-3 left-2'>
          <SideDrawer />
        </div>
    <div className="flex-grow ">
          {children}
    </div>
    </div>
  )
}
}

export default Layout