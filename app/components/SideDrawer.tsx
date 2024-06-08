'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import {userStore} from '../Zustand/zustand'
import { FiUsers } from "react-icons/fi";
import Image from 'next/image';
import { useRouter } from 'next/navigation'

export default function SideDrawer() {

    

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };


  const [role, setRole] = React.useState<any>(null)
  const decoded = userStore((state) => state.fetchDecoded);
  const inactiveLink = 'flex gap-1 p-1';
  const activeLink = inactiveLink+' bg-highlight text-black rounded-sm';
  const inactiveIcon = 'w-6 h-6';
  const activeIcon = inactiveIcon + ' text-primary';

  const fetchData = async() =>{
    const decoded_data = await decoded()
    if(decoded_data){
        // setRole(decoded_data.decoded.role)
        console.log('role',decoded_data.decoded.role)
        setRole(decoded_data.decoded.role)
        const token = decoded_data

    }
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  const pathname = usePathname()

  const router = useRouter()

  const DrawerList = (
    <Box className='bg-black w-[11rem] min-h-[100%] md:hidden' 
    // sx={{ width: 180, bgcolor:'black' }} 
    role="presentation" onClick={toggleDrawer(false)}>
      
      <nav className="flex flex-col gap-2">
        <div className={`mt-6 mb-8 px-5`} onClick={(e) => {e.preventDefault();router.push('/')}}>
        <div className="flex">
      <div className='h-[1.5rem] w-[1.5rem]  md:w-[3rem] md:h-[3rem] bg-white'>
        </div>
        <div className='text-white -ml-5 mt-1 text-sm md:text-xl font-Baskervville font-bold md:-ml-7 md:mt-3'><span className='text-black'>nu</span>ntium.</div>
        </div>
        </div>


        {role === 'admin' ? 
        <div className={`${pathname === '/user' ? 'bg-[#545A61] text-white': ''} hover:bg-[#545a61] px-5 py-2`} onClick={(e) => {e.preventDefault();router.push('/user')}}  >
            <div className="flex text-white">
          {/* <span > <MdOutlineDashboardCustomize size={25}/> </span> */}
          <span className="hidden md:flex"> 
            <Image 
            src={'/grid_1.svg'}
            alt="user_icon"
            width={200}
            height={200}
            className="w-3 h-3 md:w-6 md:h-6"
            />
             </span>
          <span className="text-sm md:text-base md:ml-4">
          Dashboard
          </span>
            </div>
        </div>
        : null }
        
        <div onClick={(e) => {e.preventDefault();router.push('/user/profile')}} className={`${pathname === '/user/profile' ? 'bg-[#545A61] text-white': ''} hover:bg-[#545a61] px-5 py-2`} >
            <div className="flex text-white">
          {/* <span > <MdOutlineDashboardCustomize size={25}/> </span> */}
          <span className="hidden md:flex"> 
            <Image 
            src={'/user_2.svg'}
            alt="user_icon"
            width={200}
            height={200}
            className="w-5 h-5 md:w-6 md:h-6"
            />
             </span>
          <span className="text-sm md:text-base  md:ml-4">
          Profile
          </span>
            </div>
        </div>

        {role === 'writer' ? 
        <div className={`${pathname === '/user/myBlogs' ? 'bg-[#545A61] text-white': ''} hover:bg-[#545a61] px-5 py-2`} onClick={(e) => {e.preventDefault();router.push('/user/myBlogs')}} >
            <div className="flex text-white">
          {/* <span > <MdOutlineDashboardCustomize size={25}/> </span> */}
          <span className=""> 
          <Image 
            src={'/book-open.svg'}
            alt="user_icon"
            width={200}
            height={200}
            className="w-5 h-5 md:w-6 md:h-6"
            />
             </span>
          <span className="text-sm md:text-base ml-2 md:ml-4">
          My Blogs
          </span>
            </div>
        </div>
        : null}


        {role === 'admin' ?
        <div className={`${pathname === '/user/blogs' ? 'bg-[#545A61] text-white': ''} hover:bg-[#545a61] px-5 py-2`} onClick={(e) => {e.preventDefault();router.push('/user/blogs')}} >
            <div className="flex text-white">
          {/* <span > <MdOutlineDashboardCustomize size={25}/> </span> */}
          <span className="hidden md:flex"> 
            <Image 
            src={'/book-open.svg'}
            alt="user_icon"
            width={200}
            height={200}
            className="w-6 h-6"
            />
             </span>
          <span className="text-sm md:text-base md:ml-4">
          Blogs
          </span>
            </div>
        </div>
        : null
      }


        {role === 'admin' ?
        <div className={`${pathname === '/user/allUsers' ? 'bg-[#545A61] text-white': ''} hover:bg-[#545a61] px-5 py-2`} onClick={(e) => {e.preventDefault();router.push('/user/allUsers')}} >
            <div className="flex text-white">
          {/* <span > <MdOutlineDashboardCustomize size={25}/> </span> */}
          <span className="hidden md:flex md:ml-1 "> 
          <FiUsers size={20}/>
             </span>
          <span className=" text-sm md:text-base md:ml-4">
          Users
          </span>
            </div>
        </div>
        : null
      }
        {role === 'writer' ?
        <div className={`${pathname === '/user/writePost' ? 'bg-[#545A61] text-white': ''} hover:bg-[#545a61] px-5 py-2`} onClick={(e) => {e.preventDefault();router.push('/user/writePost')}} >
            <div className="flex text-white items-center">
          {/* <span > <MdOutlineDashboardCustomize size={25}/> </span> */}
          <span > 
            <Image 
            src={'/edit-2_1.svg'}
            alt="user_icon"
            width={200}
            height={200}
            className="w-5 h-5 md:w-6 md:h-6"
            />
             </span>
          <span className="text-sm md:text-base ml-2 md:ml-4">
          Write a Post
          </span>
            </div>
        </div>
        : null
      }
        

      </nav>
      
      
      
      
      
      {/* <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
      {/* <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Box>
  );

  return (
    <div>
      <button className='text-white p-1 hover:bg-slate-100 hover:text-black rounded-full' onClick={toggleDrawer(true)}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fill-rule="evenodd" d="M3 9a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 9Zm0 6.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
    </svg>
      </button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}