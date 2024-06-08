import React from 'react'
import HoverDevCards from '../components/Hover_Cards'

const Page = () => {
  return (
    <div>
            <h1 className='text-center group-hover: text-xl md:text-2xl py-4 font-Baskervville bg-black text-white '>Dashboard</h1>
          <div>
            <HoverDevCards />
          </div>
    </div>
  )
}

export default Page