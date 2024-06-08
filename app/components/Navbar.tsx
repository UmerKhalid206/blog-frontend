'use client';
import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import Link from 'next/link';
import {userStore} from '../Zustand/zustand'
import { usePathname } from 'next/navigation'
import { MdLogout } from "react-icons/md";
import Image from 'next/image';
const Navbar = () => {
    
    const [open, setOpen] = useState<boolean>(false)
    const [dropDown, setDropDown] = useState<boolean>(false)
    const [role, setRole] = useState<string>('')
    const pathname = usePathname()
    const decoded = userStore((state) => state.fetchDecoded);
    const auth = userStore((state) => state.authenticated);
    const Logout = userStore((state) => state.Logout);
    const [user, setUser] =useState<any>('')

    const Server = process.env.NEXT_PUBLIC_SERVER

    
    // let name = user.split(' ')
    // name = name[0]
    const fetchData = async() =>{
        const decoded_data = await decoded()
        if(decoded_data){
            setRole(decoded_data.decoded.role)
            console.log('role',decoded_data)
            const token = decoded_data.value
            const settings = {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            let res:any = await fetch(`${Server}/auth`, settings)
            res = await res?.json()
                setUser(res)
            console.log("u data",res)
        }
      }

    // const checkLoggedIn = async() =>{
    //     const decoded_data = await decoded()
         
    //     if(decoded_data){
    //         setUser('Hi User')
    //     }
    //     else{
    //         setUser(null)
    //     }
    
    //   }

    useEffect(() => {
        fetchData()

        window.onclick= function (){
            setDropDown(false)
          }
    }, [auth])
 
    // console.log('pathname',pathname)


    let searchStyles:string = `border-[1.5px] border-black rounded-lg`

    const openSearch = () => {
        setOpen(filter => !filter)
    }
    const checkAuth = () => {
        console.log(auth)
    }

    const getDecoded =async() =>{
        const decoded_data = await decoded()
        console.log(decoded_data.value)

    }

const handleLogout =() => {
    Logout(false)
    setUser(null)
    setDropDown(false)
}


const openDropDown =(event:any) => {
    event.stopPropagation();
    setDropDown(!dropDown)
}

// if(dropDown === true){
//     window.onclick = function (){
//         setDropDown(false)
//     }
// }


if(pathname.includes('/user')){
    return null
}else{

  return (
    <div className='container mx-auto'>
    <div className=' my-8 mx-4 font-Baskervville'>  
    <div className='flex justify-between relative'>
    <div className='flex items-center'>
    <Link href={'/'} className={pathname === '/' ? 'font-semibold' : ''}>
        <div className='w-[2rem] h-[2rem] md:w-[3rem] md:h-[3rem] bg-black'>
        </div>
    </Link>
        <div className='text-black text-sm md:text-lg font-bold -ml-5 mt-1 md:-ml-6 md:mt-2'><span className='text-white'>nu</span>ntium.</div>
        {/* {pathname === '/forgotPassword' ? null 
        :  */}
        <div className=' gap-8 ml-10 hidden md:flex'>
        <Link href={'/'} className={pathname === '/' ? 'font-semibold' : ''}>Home</Link>
        <Link href={'/categories'} className={pathname.includes('/categories') ? 'font-semibold' : ''}>Categories</Link>
        {/* <div className=' font-semibold'>Home</div> */}
        {/* <div className=''>Categories</div> */}
        <Link href={'/about'} className={pathname.includes('/about') ? 'font-semibold' : ''}>About</Link>
        </div>
        {/* } */}
    </div>

    <div className='flex items-center gap-6'>
        {pathname === '/forgotPassword' ||  pathname === '/signup' ? null : 
            <div className={`hidden md:flex ${open ? searchStyles : "border-[1.5px] border-white"}`}>
                {open=== true ? 
                <input type="text" className=' outline-none pl-2 md:py-[0.4rem] rounded-s-lg text-sm font-medium'/>
                : null}
        <button onClick={openSearch} className='mr-2'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30 30" fill="none">
    <path d="M13.75 23.75C19.2728 23.75 23.75 19.2728 23.75 13.75C23.75 8.22715 19.2728 3.75 13.75 3.75C8.22715 3.75 3.75 8.22715 3.75 13.75C3.75 19.2728 8.22715 23.75 13.75 23.75Z" stroke="black" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round"/>
    <path d="M26.25 26.25L20.8125 20.8125" stroke="black" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round"/>
    </svg></button>
    </div>
    }

{dropDown === true ? 
    <div className='z-10 w-[10rem] flex flex-col font-sans absolute top-[4.75rem] right-0 md:top-16 md:right-0 bg-white  shadow-lg  rounded-md pt-2'>
        <div className='flex font-bold mb-2 px-2 gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 mt-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            
            <span>
            {user?.name}
            </span>
        </div>
        <hr className='md:hidden text-[#eee]'/>
        <div className='md:hidden flex flex-col text-sm'>
            <Link href={'/'} onClick={()=>openDropDown(event)} className='flex px-2 py-1 gap-2 hover:bg-[#eee]'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
                <span>
                 Home
                </span>
                </Link>
            <Link href={'/categories'} onClick={()=>openDropDown(event)} className='flex px-2 py-1 gap-2 hover:bg-[#eee]'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
             <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
            </svg>

                <span>
                 Categories
                </span>
                </Link>
            <Link href={'/about'} onClick={()=>openDropDown(event)} className='flex px-2 py-1 gap-2 hover:bg-[#eee]'>
            <svg
      className="w-5 h-5 text-black"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 4H16V10" stroke="#000000" stroke-width="1.5" />
      <path d="M16 4L8 12" stroke="#000000" stroke-width="1.5" />
      <path d="M8 6H4V16H14V12" stroke="#000000" stroke-width="1.5" />
    </svg>
                <span>
                About
                </span>
                </Link>
            {/* {role === 'writer' ?  */}
            {/* <Link onClick={()=>openDropDown(event)} href={'/categories'} className='px-5 py-1 hover:bg-[#eee]'>Categories</Link>
            <Link onClick={()=>openDropDown(event)} href={'/about'} className='px-5 py-1 hover:bg-[#eee]'>About</Link> */}
            {/* : null} */}
            {/* <button onClick={handleLogout} className='px-5 py-1 hover:bg-[#eee]'>Logout</button> */}
        </div>

        <hr className='text-[#eee]'/>
        <div className='flex flex-col  text-sm '>
            {/* <Link href={'/user/profile'} onClick={()=>openDropDown(event)} className='px-5 py-1 hover:bg-[#eee]'>Profile</Link> */}
            <Link href={'/user/profile'} onClick={()=>openDropDown(event)} className='flex px-2 py-1 gap-2 hover:bg-[#eee]'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
                <span>
                Profile
                </span>
                </Link>
            {role === 'writer' ? 
            <Link href={'/user/writePost'} onClick={()=>openDropDown(event)} className='flex px-2 py-1 gap-2 hover:bg-[#eee]'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5">
             <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
                <span>
                Write a Post
                </span>
                </Link>
            // <Link onClick={()=>openDropDown(event)} href={'/user'} className='px-5 py-1 hover:bg-[#eee]'>Write a Post</Link>
            : null}
            <button onClick={handleLogout} className='flex px-2 py-1 gap-2 text-start hover:bg-red-600 hover:text-white rounded-b-md'><span><MdLogout size={18} className='ml-[0.15rem]'/></span><span className=''>Logout</span></button>
        </div>
    </div>
    : 
    null
}
    {user? 
    <button className='flex justify-center items-center hover:bg-gray-100 transition duration-300 hover:scale-105 rounded-full' onClick={()=>openDropDown(event)}>
        {/* {user} */}
        <Image 
        src={user?.image_url || '/avatar-pic2.png'}
        alt='profile pic'
        width={500}
        height={500}
        className='w-16 h-16 rounded-full'
        />
    </button>
    :

    <div>{pathname === '/forgotPassword' ||  pathname === '/signup' ? null :  <Link href={'/signup'}><button className='border-[1.5px] border-black text-center py-1 px-4 rounded-lg font-medium'>Login</button></Link>}</div>
}
    </div>
        
    </div>
    </div>
    </div>
  )
}
}

export default Navbar