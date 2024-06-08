'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const Blog_Card = ({blog}) => {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    // console.log(windowWidth)
  };

  useEffect(() => {
    // Initial setup
    handleResize();

    // Event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [windowWidth === 768]);

  // console.log('width', window.innerWidth)

  let truncatedString;
  const words = blog?.description?.split(' ');

  if (words.length > 15) {
    if(windowWidth >= 768 ){
      // console.log(windowWidth)
      const words = blog?.description?.split(' ');
      const truncatedWords = words.slice(0, 25);
    truncatedString = `${truncatedWords.join(' ')} ......`;
    }
    const truncatedWords = words.slice(0, 20);
    truncatedString = `${truncatedWords.join(' ')} ......`;

  } 
  else {
    truncatedString = blog?.description
  }

  const dateObj = new Date(blog?.updatedAt);
  const formattedDate = dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex w-[20rem] h-[8rem] sm:h-[10rem] sm:w-[27rem] md:w-[33rem] md:h-[13.5rem] lg:w-[45rem] mt-10 overflow-hidden">
      {/* <div className='font-bold text-2xl'>{numberOfWords}</div> */}
      <div className="flex justify-center gap-2 sm:justify-between lg:gap-6 w-full">
      <div className='w-[48%]'>
      <Link href={'/articleDetails?id='+blog?._id}>
        <Image className='w-full h-full rounded-lg hover:scale-105 transition duration-300' src={blog?.images || '/rectangle.png'} width={280} height={250} alt="card-img" />
      </Link>
      </div>
      <div className='w-[45%]'>
        <div className="text-Gray font-sans text-xs font-medium M_L:text-sm lg:text-[0.9rem]">{blog?.category?.name}</div>
        <h1 className='text-sm md:leading-6 sm:text-base md:text-[1.15rem] lg:text-[1.4rem] font-bold'>{blog?.title}</h1>
        <div className="flex text-Gray font-sans text-xs md:text-sm mt-2 gap-2 md:gap-4">
          <span className="">{blog?.user?.name}</span>
          <span className="hidden sm:flex text-Gray -mt-1 font-bold">.</span>
          <span className='hidden sm:flex'>{formattedDate}</span>
        </div>
        <p className="hidden sm:flex font-sans text-xs leading-5 mt-2">
          {/* {blog.description} */}
          {/* {words} */}
          {/* {description} */}
          {truncatedString}
        </p>
      </div>
      </div>
    </div>
  );
};

export default Blog_Card;
