'use client'
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { useEffect, useState } from "react";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import {userStore} from '../Zustand/zustand'
import { FiUsers } from "react-icons/fi";


export default function SideNav({show}) {

  const [role, setRole] = useState<any>(null)
  const decoded = userStore((state) => state.fetchDecoded);
  const inactiveLink = 'flex gap-1 p-1';
  const activeLink = inactiveLink+' bg-highlight text-black rounded-sm';
  const inactiveIcon = 'w-6 h-6';
  const activeIcon = inactiveIcon + ' text-primary';

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

  const pathname = usePathname()
  async function logout() { 
  }



  return (
    <aside className={(show?'left-0':'-left-full')+" min-h-[100%]  absolute top-0 text-gray-500 p-4  px-0 w-[8rem]  md:static md:w-auto transition-all bg-black"}>
      <div className="mb-4 mr-4">
        
      </div>
      <nav className="flex flex-col gap-2 md:w-[12rem]">
        <Link className={`mt-3 mb-10 px-5`} href={'/'}>
        <div className="flex">
      <div className='h-[1.5rem] w-[1.5rem]  md:w-[3rem] md:h-[3rem] bg-white'>
        </div>
        <div className='text-white -ml-4 mt-1 text-sm md:text-xl font-Baskervville font-bold md:-ml-7 md:mt-3'><span className='text-black'>nu</span>ntium.</div>
        </div>
        </Link>


        {role === 'admin' ? 
        <Link className={`${pathname === '/user' ? 'bg-[#545A61] text-white': ''} hover:bg-[#545a61] px-5 py-2`} href={'/user'} >
            <div className="flex text-white">
          {/* <span > <MdOutlineDashboardCustomize size={25}/> </span> */}
          <span className="hidden md:flex"> 
            <Image 
            src={'/grid_1.svg'}
            alt="user_icon"
            width={200}
            height={200}
            className="w-3 h-3 md:w-6 md:h-6"
            />
             </span>
          <span className="text-sm md:text-base md:ml-4">
          Dashboard
          </span>
            </div>
        </Link>
        : null }
        
        <Link className={`${pathname === '/user/profile' ? 'bg-[#545A61] text-white': ''} hover:bg-[#545a61] px-5 py-2`} href={'/user/profile'} >
            <div className="flex text-white">
          {/* <span > <MdOutlineDashboardCustomize size={25}/> </span> */}
          <span className="hidden md:flex"> 
            <Image 
            src={'/user_2.svg'}
            alt="user_icon"
            width={200}
            height={200}
            className="w-6 h-6"
            />
             </span>
          <span className="text-sm md:text-base md:ml-4">
          Profile
          </span>
            </div>
        </Link>

        {role === 'writer' ? 
        <Link className={`${pathname === '/user/myBlogs' ? 'bg-[#545A61] text-white': ''} hover:bg-[#545a61] px-5 py-2`} href={'/user/myBlogs'} >
            <div className="flex text-white">
          {/* <span > <MdOutlineDashboardCustomize size={25}/> </span> */}
          <span className="hidden md:flex"> 
          <Image 
            src={'/book-open.svg'}
            alt="user_icon"
            width={200}
            height={200}
            className="w-6 h-6"
            />
             </span>
          <span className="text-sm md:text-base md:ml-4">
          My Blogs
          </span>
            </div>
        </Link>
        : null}


        {role === 'admin' ?
        <Link className={`${pathname === '/user/blogs' ? 'bg-[#545A61] text-white': ''} hover:bg-[#545a61] px-5 py-2`} href={'/user/blogs'} >
            <div className="flex text-white">
          {/* <span > <MdOutlineDashboardCustomize size={25}/> </span> */}
          <span className="hidden md:flex"> 
            <Image 
            src={'/book-open.svg'}
            alt="user_icon"
            width={200}
            height={200}
            className="w-6 h-6"
            />
             </span>
          <span className="text-sm md:text-base md:ml-4">
          Blogs
          </span>
            </div>
        </Link>
        : null
      }


        {role === 'admin' ?
        <Link className={`${pathname === '/user/allUsers' ? 'bg-[#545A61] text-white': ''} hover:bg-[#545a61] px-5 py-2`} href={'/user/allUsers'} >
            <div className="flex text-white">
          {/* <span > <MdOutlineDashboardCustomize size={25}/> </span> */}
          <span className="hidden md:flex md:ml-1 "> 
          <FiUsers size={20}/>
             </span>
          <span className=" text-sm md:text-base md:ml-4">
          Users
          </span>
            </div>
        </Link>
        : null
      }

        
        {role === 'writer' ?
        <Link className={`${pathname === '/user/writePost' ? 'bg-[#545A61] text-white': ''} hover:bg-[#545a61] px-5 py-2`} href={'/user/writePost'} >
            <div className="flex text-white">
          {/* <span > <MdOutlineDashboardCustomize size={25}/> </span> */}
          <span > 
            <Image 
            src={'/edit-2_1.svg'}
            alt="user_icon"
            width={200}
            height={200}
            className="w-6 h-6"
            />
             </span>
          <span className=" ml-4">
          Write a Post
          </span>
            </div>
        </Link>
        : null
      }
        

      </nav>
    </aside>
  );
}