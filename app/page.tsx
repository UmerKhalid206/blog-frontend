// 'use client'
import { useEffect } from "react";
import Article from "./components/Article";
import Editor_pick from "./components/Editor_pick";
import Hero from "./components/Hero-section";
import Navbar from "./components/Navbar";

export default function Home() {

  // const Server = 'http://localhost:3000'
  // console.log(Server)
  // const fetchData = async() =>{
  //   let res = await fetch(`${Server}/blogs`)
  //   res = await res.json()
  //   console.log(res)
  // }

  // useEffect(()=>{
  //   fetchData();
  // }, [])

  return (
    <div  className='font-Baskervville container mx-auto'>
      <div className="mx-4 mb-12">
    <Hero />
    <Editor_pick />
    <Article />
      </div>
    {/* <h1 className="bg-black text-white">hi</h1> */}
    </div>
  );
}
