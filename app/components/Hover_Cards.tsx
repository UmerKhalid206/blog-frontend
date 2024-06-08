'use client'
import React, { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { FiCreditCard, FiMail, FiUser, FiUsers } from "react-icons/fi";

import {userStore} from '../Zustand/zustand'
import { FadeLoader } from "react-spinners";


const Server = process.env.NEXT_PUBLIC_SERVER
const HoverDevCards = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [role, setRole] = useState<string>('')

  const [totalUsers, setTotalUsers] = useState<any>()
  const [blockedUsers, setBlockedUsers] = useState<any>()
  const [unBlockedUsers, setUnBlockedUsers] = useState<any>()

  const [totalBlogs, setTotalBlogs] = useState<any>()
  const [approvedBlogs, setApprovedBlogs] = useState<any>()
  const [unApprovedBlogs, setUnApprovedBlogs] = useState<any>()


  const decoded = userStore((state) => state.fetchDecoded);


  const fetchData = async() =>{
    setIsLoading(true)
    const decoded_data = await decoded()
    const token = decoded_data.value
    console.log("decoded_data",decoded_data.decoded.role)
    setRole(decoded_data.decoded.role)
    const settings = {
      method: "GET",
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
      } 
  };
    let res:any = await fetch(`${Server}/admin/userCount`, settings)
    res = await res?.json()
    setTotalUsers(res?.total)
    setBlockedUsers(res?.blocked)
    setUnBlockedUsers(res?.unblocked)
    console.log("users", res)


    let blogsres:any = await fetch(`${Server}/admin/blogCount`, settings)
    blogsres = await blogsres?.json()
    setTotalBlogs(blogsres?.total)
    setApprovedBlogs(blogsres?.approved)
    setUnApprovedBlogs(blogsres?.unApproved)
    console.log("blogs", blogsres)

    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])
    let total=6, blocked=2, unblocked
    let blockedPercentage = blocked / total * 100
    if(role === 'admin'){
    
  return (
    <div className="p-4 flex flex-col">


      {isLoading === false ? 
      <div>
        <p className="text-xl font-semibold mb-2">Users</p>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        <Card title="Total" subtitle="Users" count={totalUsers} percent={50} color="bg-black"/>
        <Card title="Blocked" subtitle="Users" count={blockedUsers} color="bg-red-500" percent={50}/>
        <Card title="Unblocked" subtitle="Users" count={unBlockedUsers}  color="bg-green-500" percent={50}/>

      </div>

      <div className="mt-12">
      <p className="text-xl font-semibold mb-2">Blogs</p>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
      
        <Card title="Total" subtitle="Blogs" count={totalBlogs} color="bg-black" percent={50}/>
        <Card title="Approved" subtitle="Blogs" count={approvedBlogs} color="bg-green-500" percent={50}/>
        <Card title="UnApproved" subtitle="Blogs" count={unApprovedBlogs} color="bg-red-500" percent={50}/>

      </div>
      </div>
      </div>

      :
<div className='flex flex-col justify-center items-center mt-6 h-[60vh]'>
      <FadeLoader color="#000000" />
      </div>
    }
    </div>
  );
}
};

interface CardType {
  title: string;
  subtitle: string;
  count: number;
  color: string;
  percent: number;
}

const Card = ({ title, subtitle, count, color, percent }: CardType) => {
  return (
    <a
    //   href={href}
      className="sm:w-full cursor-pointer p-4 rounded border-[1px] border-slate-300 relative overflow-hidden group bg-white"
    >
      <div className={`${color} absolute inset-0  -translate-x-[50%] group-hover:-translate-x-[0%] transition-transform duration-700`} />

      {/* <Icon className="absolute z-10 -top-12 -right-12 text-9xl text-slate-100 group-hover:text-white group-hover:rotate-12 transition-transform duration-300" /> */}
      {/* <Icon className="mb-2 text-2xl text-violet-600 group-hover:text-white transition-colors relative z-10 duration-300" /> */}
      
      
      <h3 className="font-medium font-Baskervville -mt-3 text-[1.15rem] md:text-[1.35rem] text-white relative z-10 duration-300">
        {title}
      </h3>
      <p className="ml-2 text-sm text-slate-300 group-hover:text-white relative z-10 duration-300">
        {subtitle}
      </p>

      <h3 className="text-end font-medium font-Baskervville text-3xl text-slate-950 group-hover:text-white relative z-10 duration-300">
        {count}
      </h3>
    </a>
  );
};

export default HoverDevCards;