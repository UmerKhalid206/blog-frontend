'use client'
import EditProfile from '@/app/components/editProfile'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import {userStore} from '../../Zustand/zustand'
import { FadeLoader } from 'react-spinners'


const Server = process.env.NEXT_PUBLIC_SERVER
const Page = () => {

  
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [userDetails, setUserDetails] = useState<any>()
  const [updated, setUpdated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const decoded = userStore((state) => state.fetchDecoded);

  const handleModal = () => {
    setOpenModal(openModal => !openModal)
  }

  const closeModal = (value:boolean) => {
    setOpenModal(value)
  }

  const refreshOnUpdate = (value:boolean) =>{
    setUpdated(value)
  }

  const fetchData = async() =>{
    setLoading(true)
    setUpdated(false)
    const decoded_data = await decoded()
    if(decoded_data){
        const token = decoded_data.value
        const settings = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        let res:any = await fetch(`${Server}/auth`, settings)
        res = await res.json()
        setUserDetails(res)
        setLoading(false)
        console.log("user data",res)
      }
      setLoading(false)
  }

  useEffect(() =>{
    fetchData()
  },[updated])


  function capitalizeWords(str:string) {
    // Split the string into an array of words
    let words = str?.split(' ');
    // Capitalize the first letter of each word
    let capitalizedWords = words?.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    // Join the words back into a string
    let result = capitalizedWords?.join(' ');
  
    return result;
  }

  let capitalName = capitalizeWords(userDetails?.name);

  function insertLineBreaks(text:string, wordsPerLine:number) {
    if (!text) {
      return null;
    }
  
    const words = text.split(' ');
    const lines = [];
  
    for (let i = 0; i < words.length; i += wordsPerLine) {
      lines.push(words.slice(i, i + wordsPerLine).join(' '));
    }
  
    return lines.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br className='hidden lg:inline-block'/>
      </React.Fragment>
    ));
  }
  

  return (
    <>
    <h1 className='text-center group-hover: text-xl md:text-2xl py-4 font-Baskervville bg-black text-white '>Profile</h1>
    <div className='flex flex-col items-center'>
      {loading ? 
      <div className='flex flex-col justify-center items-center mt-4 h-[50vh]'>
      <FadeLoader color="#000000" />
      </div>  
      :
      <div className='my-8'>
    <div className="flex flex-col lg:flex-row mt-4 gap-6 md:mx-16">
      <div className="flex justify-center md:justify-start">
        <div>
          <Image
            src={userDetails?.image_url || '/Profile_Picture.png'}
            alt={'author image'}
            width={200}
            height={200}
            className="rounded-full border w-32 h-32"
          />
        </div>
      </div>
      <div className="flex flex-col mt-4 mx-8 sm:mx-28 md:mx-0">
        <h1 className="text-base sm:text-base md:text-[1.15rem] lg:text-2xl font-bold">
        {capitalName}
        </h1>
        <span className='text-Gray my-1 text-xs'>
          {userDetails?.email}
          </span>
          <p className='text-sm font-sans'>
  {userDetails?.profileSummary
    ? insertLineBreaks(userDetails.profileSummary, 12)
    : (
      <>
        Ipsum adipisicing culpa est nisi consequat ex amet magna
        <br className='hidden md:inline-block' />
        culpa veniam tempor irure ea. Reprehenderit labore do
        <br className='hidden md:inline-block' />
        tempor eiusmod in consectetur ex sunt id.
      </>
    )}
</p>

        
        <div className='flex justify-end mt-2'>
          <button onClick={handleModal} className='px-3 py-2 flex items-center gap-2 bg-[#e4e6eb] rounded-md hover:bg-gray-300 transition'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
          </svg>
          <span className='text-sm font-semibold'>
            Edit Profile
          </span>
            </button>
            {openModal ? 
            <EditProfile closeModal={closeModal} profileData={userDetails} refreshOnUpdate={refreshOnUpdate}/>
            : null}
        </div>
      </div>
      </div>
    </div>
    }
    </div>
    </>
  )
}

export default Page