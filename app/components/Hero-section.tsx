import Image from 'next/image'
import React from 'react'
import Featured from './Featured'

const Hero = () => {
  return (
    <div className=''>
        <div className='absolute'><Featured /></div>
        <div className=' md:h-[29rem] md:w-full'>
        <Image
        src={'/hero-img.png'}
        height={500}
        width={500}
        // fill={true}
        alt='hero-image'
        className='w-full h-[18rem] md:h-[29rem]'
        />
        </div>
        

    </div>
  )
}

export default Hero