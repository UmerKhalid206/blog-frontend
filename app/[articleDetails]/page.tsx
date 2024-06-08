'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
// import Component from '../components/Reactions'
import ReactionsPicker from '../components/Reactions';
import ReactedPeople from '../components/ReactedPeople';

import {userStore} from '../Zustand/zustand'

const Page = () => {
  const [blog, setBlog] = useState<any>({});
  const [likes, setLikes] = useState<any>([]);
  const [sads, setSads] = useState<any>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [showLike, setShowLike] = useState<boolean>(true);
  const [showSad, setShowSad] = useState<boolean>(false);
  const [openPeopleDiv, setOpenPeopleDiv] = useState<boolean>(false);
  const [myReaction, setMyReaction] = useState<string | null>(null);


  const [reaction, setReaction] = useState<any>(null);

  const reactionData = userStore((state) => state.reaction);
  const decoded = userStore((state) => state.fetchDecoded);
  const auth = userStore((state) => state.authenticated);
  
  // console.log('auth', auth)

  const fetchData = async () => {

    const decoded_data = await decoded()
    // console.log("decoded data",decoded_data?.decoded?.id)
    const searchParams = new URLSearchParams(window.location.search);
    const idFromUrl = searchParams.get('id');
    const Server = process.env.NEXT_PUBLIC_SERVER;
    let res:any = await fetch(`${Server}/blogs/${idFromUrl}`);
    res = await res?.json();
    setBlog(res);

    let likes = res?.reactions?.like?.map((like:any) => like)
    setLikes(likes)
    if(!likes?.length){
      setShowSad(true)
    }
    
    let sads = res?.reactions?.sad?.map((sad:any) => sad)
    setSads(sads)

    setOpen(false)

    let meInLikes = res?.reactions?.like?.filter((like:any) => like._id === decoded_data?.decoded.id)
    let meInSads = res?.reactions?.sad?.filter((sad:any) => sad._id === decoded_data?.decoded.id)

    if(meInLikes?.length){
      setMyReaction('👍') 
    }else if(meInSads?.length){
      setMyReaction('😢')
    }


    
  };

  

  useEffect(() => {
    fetchData();
    window.onclick= function (){
      setOpenPeopleDiv(false)
      setOpen(false)
    }
  }, [reactionData]);

  const dateObj = new Date(blog.updatedAt);
  const formattedDate = dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // console.log(blog._id);

  const openReactions = (event:any) =>{
    event.stopPropagation()
    setOpen(!open)
    setOpenPeopleDiv(false)
  }


  const peopleWhoReacted = (event:any) => {
    event.stopPropagation();
    setOpenPeopleDiv(!openPeopleDiv)
    // console.log('likes', likes, 'sads => ', sads)
    setOpen(false)
  }

  const handleShowLike = () =>{
    setShowLike(true)
    setShowSad(false)
  }

  const handleShowSad = () =>{
    setShowSad(true)
    setShowLike(false)
  }

  console.log('blog',blog)

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
      <div className="font-Baskervville mb-20 container mx-auto">
        <div className="mx-4 flex flex-col items-center">
          <div className=" md:h-[25rem] md:w-full">
            <Image
              src={blog.images}
              height={500}
              width={500}
              // fill={true}
              alt="hero-image"
              className="w-full h-[18rem] md:h-[25rem]"
            />
          </div>
          <div className="flex flex-col items-center">
            <div className=" flex flex-col items-center my-8 w-[20rem] sm:w-[27rem] md:w-[33rem]  lg:w-[45rem]">
              <h1 className="px-6 sm:px-0 text-base text-center sm:text-base md:text-[1.15rem] lg:text-2xl font-bold">
                {blog.title}
              </h1>
              <div className="flex text-Gray font-sans text-xs md:text-sm mt-2 gap-2 md:gap-4">
                <span className="">{blog?.user?.name}</span>
                <span className="flex text-Gray -mt-1 font-bold">.</span>
                <span className="flex">{formattedDate}</span>
              </div>
              <span className="mt-2 text-Gray font-sans text-xs md:text-sm">
                #{blog?.category?.name}
              </span>
              <div className="px-6 sm:px-0 text-base text-start leading-5 mt-4">
                {blog?.description}
              </div>
            </div>
          </div>
          <div>
          </div>
          <div className="relative mt-10 px-6 sm:px-0 w-[20rem] sm:w-[27rem] md:w-[33rem]  lg:w-[45rem]">
            <div className=''>
              {blog?.reactions ? 
              <div className='flex gap-4'>
              <button onClick={peopleWhoReacted}>
              <span>{likes?.length ? '👍' : null}</span>
              <span>{sads?.length ? '😢' : null}</span>
              </button>
              <div className='text-sm text-Gray mt-1'>
                {likes?.length + sads?.length === 1 && myReaction ? <span>only you reacted</span> : !myReaction ? <span>{likes?.length + sads?.length} person reacted</span> : <span>you and {likes?.length + sads?.length - 1} others reacted</span>}
                {/* <span >{myReaction ? `you`: null}</span> and <span>{likes?.length + sads?.length - 1 }</span> others reacted */}
                </div>
              </div> 
              : 
              null
              }

              {openPeopleDiv === true ? 
              <div onClick={(event) => event.stopPropagation()} className='flex flex-col gap-4 absolute -mt-48 bg-[#eee] rounded-lg px-4 py-6 w-[10rem] h-[10rem] overflow-y-scroll overflow-x-hidden no-scrollbar'>
                <div className='flex gap-8'>
                {likes?.length ? 
                  <button onClick={handleShowLike} className={`${showLike ===true ? 'border-red-500' : 'border-b-[#eee]'} border-b-2 hover:border-red-500`}>👍</button>
                : null}
                  <button onClick={handleShowSad} className={`${showSad ===true ? 'border-red-500' : 'border-b-[#eee]'} border-b-2 hover:border-red-500`}>😢</button>
                  
                  </div>

                  {showLike ===true ?
                <div className='flex flex-col'>
                  {likes?.map((like:any) => (<div key={like._id}> <ReactedPeople data={like} /></div>))}
                </div>
                : null}

                {showSad === true ?  
                <div className='flex flex-col'>
                {sads?.map((sad:any) => (<div key={sad._id}> <ReactedPeople data={sad}/></div>))}
                </div>
                : null}


              </div>
              : null
              }
             
            </div>
            <hr className='my-2'/>
            {auth? 
            <div>
            {myReaction ? <button onClick={openReactions}>{myReaction}</button> 
            : 
              <div className='mt-2'>
              <ReactionsPicker id={blog?._id}/>
              </div>
            }
            
             {open ? 
              <div className='absolute -top-14 border p-1 rounded-xl'><ReactionsPicker id={blog?._id}/></div> 
              : null}

          </div>

              : null} 
              <div className='mt-8'>
            <h3 className="text-center  md:text-start font-sans text-Gray">ABOUT THE AUTHOR</h3>
            <div className="flex flex-col lg:flex-row mt-4 gap-6">
              <div className="flex justify-center sm:justify-start">
                <div>
                  <Image
                    src={blog?.user?.image_url ||'/Profile_Picture.png'}
                    alt={'author image'}
                    width={200}
                    height={200}
                    className="rounded-full border w-32 h-32"
                  />
                </div>
              </div>
              <div className="flex flex-col mt-4">
                <h1 className="text-base sm:text-base md:text-[1.15rem] lg:text-2xl font-bold">
                  {blog?.user?.name}
                </h1>
                <span className='text-Gray my-1 text-xs'>{blog?.user?.name}</span>
                <p className=' text-sm font-sans'>

                {blog?.user?.profileSummary
    ? insertLineBreaks(blog?.user?.profileSummary, 10)
    : (
      <>
        Ipsum adipisicing culpa est nisi consequat ex amet magna <br className='hidden md:inline-block'/> culpa
        veniam tempor irure ea. Reprehenderit labore do <br className='hidden md:inline-block'/>tempor eiusmod
        in consectetur ex sunt id.
      </>
    )}

                  
                </p>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
