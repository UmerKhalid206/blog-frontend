import React from 'react'

const Search = () => {
  return (
    <div>
        <div className={`flex justify-between border-[1px] border-black rounded-lg md:w-[30rem]`}>
               
                <input type="text" className='outline-none pl-2 py-[0.4rem] w-[92%] rounded-s-lg text-sm font-medium'/>
              
        <button  className='mr-2'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30 30" fill="none">
    <path d="M13.75 23.75C19.2728 23.75 23.75 19.2728 23.75 13.75C23.75 8.22715 19.2728 3.75 13.75 3.75C8.22715 3.75 3.75 8.22715 3.75 13.75C3.75 19.2728 8.22715 23.75 13.75 23.75Z" stroke="black" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round"/>
    <path d="M26.25 26.25L20.8125 20.8125" stroke="black" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round"/>
    </svg></button>
    </div>
    </div>
  )
}

export default Search