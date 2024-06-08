'use client'
import React, { useEffect, useState } from 'react'
import {userStore} from '../../Zustand/zustand'
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

    if(role === 'admin'){
  return (
    
        
    <div className="flex flex-grow">
          {children}
    </div>
   
  )
}
}

export default Layout