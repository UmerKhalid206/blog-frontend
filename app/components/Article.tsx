import Image from 'next/image'
import React from 'react'
import Featured from './Featured'

const Article = () => {
  return (
    <div className='relative mt-14'>
        <div className='absolute right-12 top-10'><Featured /></div>
        <div className=''>
            <Image 
            src={'/Article_Image.png'}
            alt='article_image'
            height={500}
            width={500}
            className='w-full h-[18rem] md:h-[29rem]'
            />
        </div>
    </div>
  )
}

export default Article