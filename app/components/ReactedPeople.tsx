'use client'
import Image from 'next/image'
import React from 'react'

const ReactedPeople = ({data}) => {
    console.log('data', data)
  return (
    <div className='flex items-center gap-2 -ml-2 mt-2'>
        <div className='w-6 h-6'>
        <Image
                    src={data?.image_url || '/Profile_Picture.png'}
                    alt={'person image'}
                    width={200}
                    height={200}
                    className="w-full h-full rounded-full"
                  />
        </div>
        <div className=' text-xs font-semibold mt-[0.15rem]'>{data?.name}</div>
    </div>
  )
}

export default ReactedPeople