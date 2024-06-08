import React from 'react';

const Featured = () => {
  return (
    <div className="bg-white py-6 px-2 w-[13rem] M_L:w-[18rem] M_L:px-4 sm:w-[21rem] ml-2 rounded-b-md md:px-10  md:ml-12 md:py-12  md:w-[28.5rem]">
      <span className="text-Gray font-sans text-xs font-medium M_L:text-sm lg:text-[0.9rem]">
        FEATURED ARTICLE
      </span>
      <h1 className="text-sm M_L:text-lg md:text-xl lg:text-2xl font-bold">
        Most Dangerous
         Technology Ever Made.
      </h1>
      <div className="flex text-Gray font-sans text-xs md:text-sm mt-2 gap-2 md:gap-4">
        <span className="">Ralph Hawkins</span>
        <span className="text-Gray -mt-1 font-bold">.</span>
        <span>May 7, 2019</span>
      </div>
      <p className='hidden md:block font-sans text-xs mt-2'>
        Proident aliquip velit qui commodo officia qui consectetur dolor ullamco
        aliquip elit incididunt. Ea minim ex consectetur excepteur. Ex laborum
        nostrud mollit sint consectetur Lorem amet aliqua do enim. Commodo duis
        dolor anim excepteur. In aliquip mollit nulla consequat velit magna.
      </p>
    </div>
  );
};

export default Featured;
