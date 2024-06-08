'use client'
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import * as Components from "../components/Auth_Card";
import { FiUser } from "react-icons/fi";
import Image from 'next/image';
import { HiOutlineMail } from "react-icons/hi";
import axios from 'axios';
import {useRouter} from "next/navigation";
import {toast} from 'react-hot-toast'
import {userStore} from '../Zustand/zustand'
import { MdOutlineWorkHistory } from "react-icons/md";
import { useForm, SubmitHandler } from "react-hook-form";
import Modal from '../components/Modal';
import Link from 'next/link';
import { PiEyeClosed } from 'react-icons/pi';

interface IFormInput {
  name: string;
  email: string;
  role: string;
  password: string;
}


const Page = () => {
  const router = useRouter();

  const [signIn, toggle] = useState(true);
  const [BtnDisable, setBtnDisable] = useState(false);
  const [BtnDisableSignUp, setBtnDisableSignUp] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [roleError, setRoleError] = useState<string | null>(null)

  const [showSignIn, setShowSignIn] = useState<boolean>(true);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showSignInPassword, setShowSignInPassword] = useState<boolean>(false);
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [flag,setFlag] = useState(false);
  const [dropDown, setDropDown] = useState<boolean>(false)
  let [isOpen, setIsOpen] = useState(false)

  const login = userStore((state) => state.Login);
  const signUp = userStore((state) => state.SignUp);
  const decoded = userStore((state) => state.fetchDecoded);

  const checkLoggedIn = async() =>{
    const decoded_data = await decoded()

    if(decoded_data){
      router.push('/')
    }

  }

  useEffect(() => {
    checkLoggedIn()

    window.onclick= function (){
      setDropDown(false)
    }
  }, [])


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();

  const handleSignUp:any = async( data:any) =>{
    // alert('signup')
    // e.preventDefault()
    
    if(role === ''){
      // console.log('role empty')
      setRoleError('Please select a role')
    }
    

    // return
    const name = data.name;
    data = Object.assign(data, {
      role: role
    })
    // console.log("input role",role)
    console.log("input data",data)
    // const password = data.userPass;
    if(data){
      setBtnDisableSignUp(true)
      const res = await signUp(data)
      if(res.token){
        router.push('/')
       toast.success('SignUp Successful', {position: 'top-right'})
      }
      
    }
    
    setBtnDisableSignUp(false)
  }

  const handleEmailFocus = () => {
    setEmailError(false);
  };
  const handlePasswordFocus = () => {
    setPasswordError(false);
  };

  const getDecoded = async() =>{
    const decoded_data = await decoded()
    // const 
    console.log('decoded_data',decoded_data)
  }

  const handleSignIn = async(e:any) =>{
    e.preventDefault()
    
    console.log('signin', email, password)

    if(email === '' && password === ''){
      setEmailError(true)
      setPasswordError(true)
      return;
    }else if(email === ''){
      setEmailError(true)
      return;
    }else if(password === ''){
      setPasswordError(true)
      return;
    }

    const data= {
      email, password 
  }

  if(data.email && data.password){
    setBtnDisable(true)
  }

  const res = await login(email, password)
  console.log('res from back to zustand',res)

  if(res.token){
    router.push('/')
    toast.success('Login Successful', {position: 'top-right'})
    // setBtnDisable(false)
  }
  
  
  setBtnDisable(false)

}


const handleDropDown = (event:any) => {
  event.stopPropagation();
  setDropDown(!dropDown)
  console.log('dropdown')

}

const makeToast= () => {
  toast.success('hi', {position: 'bottom-right'})
}




function closeModal() {
  setIsOpen(false)
}

function openModal(event:any) {
  event.preventDefault()
  setIsOpen(true)
}

const handleShowSignUpPassword = (event:any) =>{
  event.preventDefault()
  setShowPassword(!showPassword)
}

const handleShowSignInPassword = (event:any) =>{
  event.preventDefault()
  setShowSignInPassword(!showSignInPassword)
}

  return (
    <>
    <div className='hidden md:flex justify-center'>
    <Components.Container className=''>
      <div>
      <Components.SignUpContainer signingin={signIn}>
        <Components.Form>
          
          <div>
          <div className='font-Baskervville font-bold text-xl'>Create Account!</div>
          <p className='mt-2 mb-6 text-xs'>Sign up to start journey with nuntium.</p>
          <div className='flex bg-[#eee] p-2 gap-2 items-center rounded-lg '>
          <Image 
          src={'user_1.svg'}
          alt='user_1.svg'
          width={20}
          height={20}
          />
          <input type="text" id="name"
           {...register("name", {
            required: "Name field is required",
          })}
          placeholder='Name' className='overflow-hidden outline-none bg-transparent text-[#858585] placeholder:text-[#858585] text-sm placeholder:text-sm pt-1'/>
          </div>
          {errors.name && (
           <span className="absolute left-14 text-red-500 text-xs">
           {errors.name.message}
            </span>
          )}

          <div className='flex bg-[#eee] p-2 items-center rounded-lg mt-4'>
          <HiOutlineMail className='text-[#858585]  w-[24px] h-[24px] mr-1 pt-1'/>
          <input type="email" placeholder='Email' id="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: 'Invalid email address',
            },
          })} className='text-sm overflow-hidden outline-none bg-transparent text-[#858585] placeholder:text-[#858585] placeholder:text-sm pt-1'/>
          </div>
          {errors.email && (
           <span className="absolute left-14 text-red-500 text-xs">
           {errors.email.message}
            </span>
          )}

          <div onClick={()=>handleDropDown(event)} className='cursor-pointer flex justify-between bg-[#eee] p-2 items-center rounded-lg mt-4'>
          <div className='flex'>
          <MdOutlineWorkHistory  className='text-[#858585] w-[24px] h-[24px] mr-1 pt-1'/>
          <span 
          className='overflow-hidden outline-none bg-transparent text-sm text-[#858585] pt-1'>{role?.charAt(0).toUpperCase() + role?.slice(1) || 'Select Role'}</span>
          </div>
          <Image 
          src={'/dropdown-btn.svg'}
          alt='drop-btn'
          width={200}
          height={200}
          className='w-4 h-4 text-end mr-1'
         />
          </div>

          {role === '' ? 
           <span className="absolute left-14 text-red-500 text-xs">
           {roleError}
            </span>
          : null}

          {dropDown ===true ? 
         <div className='bg-white absolute z-50  rounded-lg overflow-y-scroll  flex flex-col  h-10 no-scrollbar w-[14.5rem] text-[#858585]  shadow-lg border'>
          <button onClick={()=>setRole('user')} className='hover:bg-black hover:text-white text-sm' >User</button>
          <button onClick={()=>setRole('writer')} className='hover:bg-black hover:text-white text-sm'>Writer</button>
         </div>
         : null
        }

          <div className='relative flex bg-[#eee] p-2 gap-2 items-center mt-4 rounded-lg'>
          <Image 
          src={'Vector.svg'}
          alt='Vector'
          width={20}
          height={20}
          />
          <input 
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be 6 character long",
            },
            pattern: {
              value: /^(?=.*[!@#$%^&*])/, // Regex for at least one special character
              message: "Password must contain a special character",
            },
          })} 
          type={showPassword ? 'text' : 'password'} placeholder='Password' className='overflow-hidden outline-none bg-transparent text-sm text-[#858585] placeholder:text-[#858585] placeholder:text-sm pt-1'/>
          <button onClick={handleShowSignUpPassword} className='absolute right-2 hover:bg-gray-300 p-1 rounded-full'>
                      {showPassword ===true ? 
                      <Image 
                      src={'/eye.png'}
                      alt='eye'
                      width={50}
                      height={50}
                      className='w-4 h-4 '
                      />
                      : 
                      <PiEyeClosed size={16} color='#858585'/>
                      } 
                      </button>
          </div>

          {errors.password && (
           <span className="absolute left-14 text-red-500 text-xs">
           {errors.password.message}
            </span>
          )}

          
          <button onClick={handleSubmit(handleSignUp)} disabled={BtnDisableSignUp} className={`${BtnDisableSignUp === true ? 'cursor-no-drop' : ''} hover:bg-black mt-5 hover:text-white border-[1px] border-[#858585] text-center py-2 px-4 rounded-lg font-medium text-black text-xs`} >Sign Up</button>
          </div>
        </Components.Form>
      </Components.SignUpContainer>
      </div>


      
      <div>
      <Components.SignInContainer signingin={signIn}>
        <Components.Form>
          <div>
          <div className='font-Baskervville font-bold text-xl'>Welcome Back!</div>
          <p className='mt-2 mb-6 text-xs'>Sign in to get the most out of nuntium.</p>
          <div className='flex bg-[#eee] p-2 gap-2 items-center rounded-lg '>
          <Image 
          src={'user_1.svg'}
          alt='user_1.svg'
          width={20}
          height={20}
          />
          <input onFocus={handleEmailFocus} type="email" placeholder='Email' onChange={(e)=>setEmail(e.target.value)} className='overflow-hidden outline-none bg-transparent text-[#858585] placeholder:text-[#858585] placeholder:text-sm pt-1'/>
          </div>
          {emailError && <div className='absolute  ml-2 text-xs text-red-500'>Email is required</div>}
          <div className='relative flex bg-[#eee] p-2 gap-2 items-center mt-4 rounded-lg'>
          <Image 
          src={'Vector.svg'}
          alt='Vector'
          width={20}
          height={20}
          />
          <input onFocus={handlePasswordFocus} type={showSignInPassword ? 'text' : 'password'} placeholder='Password' onChange={(e)=>setPassword(e.target.value)} className='overflow-hidden outline-none bg-transparent text-[#858585] placeholder:text-[#858585] placeholder:text-sm pt-1'/>
          <button onClick={handleShowSignInPassword} className='absolute right-2 hover:bg-gray-300 p-1 rounded-full'>
                      {showSignInPassword ===true ? 
                      <Image 
                      src={'/eye.png'}
                      alt='eye'
                      width={50}
                      height={50}
                      className='w-4 h-4 '
                      />
                      : 
                      <PiEyeClosed size={16} color='#858585'/>
                      } 
                      </button>
          </div>
          {passwordError && <div className='absolute ml-2 text-xs text-red-500'>Password is required</div>}
          
         <div className='flex justify-end  my-2'><Link href={'/forgotPassword'} className='text-gray-400 text-xs cursor-pointer hover:text-black'>Forgot Password?</Link></div>
          <button disabled={BtnDisable} className={`${BtnDisable === true ? 'cursor-no-drop' : ''} hover:bg-black hover:text-white border-[1px] border-[#858585] text-center py-2 px-4 rounded-lg font-medium text-black text-xs`} onClick={handleSignIn}>Sign In</button>
          </div>
          
        </Components.Form>
      </Components.SignInContainer>
      </div>
      <Components.OverlayContainer signingin={signIn}>
        <Components.Overlay signingin={signIn}>
          <Components.LeftOverlayPanel signingin={signIn}>
            <div className='font-Baskervville text-lg'>Get In!</div>
            <Components.Paragraph>
              To keep connected please login!
            </Components.Paragraph>
            
            <div><button className='bg-transparent border-white border py-2 px-4 rounded-lg text-xs hover:bg-white hover:text-black' onClick={() => toggle(true)}>Sign In</button></div>
          </Components.LeftOverlayPanel>
          <Components.RightOverlayPanel signingin={signIn}>
            {/* <Components.Title>Hello, Friend!</Components.Title> */}
            <div className='font-Baskervville  text-lg'>Hello, Friend!</div>
            <Components.Paragraph>
              Enter your details and start journey with nuntium
            </Components.Paragraph>
            
            <div><button className='bg-transparent border-white border py-2 px-4 rounded-lg text-xs hover:bg-white hover:text-black' onClick={() => toggle(false)}>Sign Up</button></div>
          </Components.RightOverlayPanel>
        </Components.Overlay>
      </Components.OverlayContainer>
    </Components.Container>
    </div>



            {/* mobile signIn */}
            {showSignIn ? 
      <div className=" flex justify-center md:hidden mb-12">
    <div className='flex flex-col justify-center rounded-[10px] shadow-lg sm:signUpShadow bg-[#fff] px-8 mx-6 sm:px-14 h-[22rem]  sm:mx-0 sm:min-h-[25rem] '>
          <div className='font-Baskervville font-bold text-lg sm:text-xl text-center'>Welcome Back!</div>
          <p className='mt-2 mb-6 text-xs text-center'>Sign in to get the most out of nuntium.</p>
          <div className='flex bg-[#eee] p-2 gap-2 items-center rounded-lg '>
          <Image 
          src={'user_1.svg'}
          alt='user_1.svg'
          width={20}
          height={20}
          />
          <input onFocus={handleEmailFocus} type="email" placeholder='Email' onChange={(e)=>setEmail(e.target.value)} className='overflow-hidden outline-none bg-transparent text-[#858585] placeholder:text-[#858585] placeholder:text-sm pt-1'/>
          </div>
          {emailError && <div className='absolute -mt-[2.4rem] ml-2 text-xs text-red-500'>Email is required</div>}
          <div className='relative flex bg-[#eee] p-2 gap-2 items-center mt-6 mb-4 rounded-lg'>
          <Image 
          src={'Vector.svg'}
          alt='Vector'
          width={20}
          height={20}
          />
          <input onFocus={handlePasswordFocus} type={showSignInPassword ? 'text' : 'password'} placeholder='Password' onChange={(e)=>setPassword(e.target.value)} className='overflow-hidden outline-none bg-transparent text-[#858585] placeholder:text-[#858585] placeholder:text-sm pt-1'/>
          <button onClick={handleShowSignInPassword} className='absolute right-2 hover:bg-gray-300 p-1 rounded-full'>
                      {showSignInPassword ===true ? 
                      <Image 
                      src={'/eye.png'}
                      alt='eye'
                      width={50}
                      height={50}
                      className='w-4 h-4 '
                      />
                      : 
                      <PiEyeClosed size={16} color='#858585'/>
                      } 
                      </button>
          </div>
          {passwordError && <div className='absolute mt-[6rem] ml-2 text-xs text-red-500'>Password is required</div>}
          
         <div className='flex justify-end  my-2'>
          <Link href={'/forgotPassword'} className='text-gray-400 text-xs cursor-pointer hover:text-black'>Forgot Password?</Link>
          </div>
          <button disabled={BtnDisable} className={`${BtnDisable === true ? 'cursor-no-drop' : ''} hover:bg-black hover:text-white border-[1px] border-[#858585] text-center py-2 px-4 rounded-lg font-medium text-black text-xs`} onClick={handleSignIn}>Sign In</button>
          <p className='text-center mt-2 text-gray-400 text-xs'>Don&#39;t have account? <button onClick={() => setShowSignIn(false)} className='text-black font-bold'>SignUp</button></p>
          </div>
    </div>

    :

  <div className=" flex justify-center md:hidden mb-12">
      {/* mobile signUp */}
    <div className='relative flex flex-col justify-center rounded-[10px] shadow-lg sm:signUpShadow bg-[#fff] px-8 mx-6 sm:px-14  sm:mx-0 min-h-[30rem] '>
          <div className='font-Baskervville font-bold text-lg sm:text-xl text-center'>Create Account!</div>
          <p className='mt-2 mb-6 text-xs text-center'>Sign up to start journey with nuntium.</p>
          
          <div className="relative">
          <div className='flex bg-[#eee] p-2 gap-2 items-center rounded-lg '>
          <Image 
          src={'user_1.svg'}
          alt='user_1.svg'
          width={20}
          height={20}
          />
          <input type="text" id="name"
           {...register("name", {
            required: "Name field is required",
          })}
          placeholder='Name' className='overflow-hidden outline-none bg-transparent text-[#858585] placeholder:text-[#858585] text-sm placeholder:text-sm pt-1'/>
          </div>
          {errors.name && (
           <span className="absolute left-2 text-red-500 text-xs">
           {errors.name.message}
            </span>
          )}
          </div>


            <div className='relative'>
          <div className='flex bg-[#eee] p-2 items-center rounded-lg mt-5'>
          <HiOutlineMail className='text-[#858585]  w-[24px] h-[24px] mr-1 pt-1'/>
          <input type="email" placeholder='Email' id="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: 'Invalid email address',
            },
          })} className='text-sm overflow-hidden outline-none bg-transparent text-[#858585] placeholder:text-[#858585] placeholder:text-sm pt-1'/>
          </div>
          {errors.email && (
           <span className="absolute top-[3.75rem] left-2 text-red-500 text-xs">
           {errors.email.message}
            </span>
          )}
          </div>

          <div onClick={()=>handleDropDown(event)} className='cursor-pointer flex justify-between bg-[#eee] p-2 items-center rounded-lg mt-5'>
          <div className='flex'>
          <MdOutlineWorkHistory  className='text-[#858585] w-[24px] h-[24px] mr-1 pt-1'/>
          <span 
          className='overflow-hidden outline-none bg-transparent text-sm text-[#858585] pt-1'>{role?.charAt(0).toUpperCase() + role?.slice(1) || 'Select Role'}</span>
          </div>
          <Image 
          src={'/dropdown-btn.svg'}
          alt='drop-btn'
          width={200}
          height={200}
          className='w-4 h-4 text-end mr-1'
         />
          </div>

          {role === '' ? 
           <span className="absolute left-14 text-red-500 text-xs">
           {roleError}
            </span>
          : null}

          {dropDown ===true ? 
         <div className='bg-white absolute z-50  rounded-lg overflow-y-scroll  flex flex-col  h-10 no-scrollbar w-[14.5rem] text-[#858585]  shadow-lg border'>
          <button onClick={()=>setRole('user')} className='hover:bg-black hover:text-white text-sm' >User</button>
          <button onClick={()=>setRole('writer')} className='hover:bg-black hover:text-white text-sm'>Writer</button>
         </div>
         : null
        }

        <div className="relative">
          <div className='relative flex bg-[#eee] p-2 gap-2 items-center mt-5 rounded-lg'>
          <Image 
          src={'Vector.svg'}
          alt='Vector'
          width={20}
          height={20}
          />
          <input 
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be 6 character long",
            },
            pattern: {
              value: /^(?=.*[!@#$%^&*])/, // Regex for at least one special character
              message: "Password must have special character",
            },
          })} 
          type={showPassword ? 'text' : 'password'} placeholder='Password' className='overflow-hidden outline-none bg-transparent text-sm text-[#858585] placeholder:text-[#858585] placeholder:text-sm pt-1'/>
          <button onClick={handleShowSignUpPassword} className='absolute right-2 hover:bg-gray-300 p-1 rounded-full'>
                      {showPassword ===true ? 
                      <Image 
                      src={'/eye.png'}
                      alt='eye'
                      width={50}
                      height={50}
                      className='w-4 h-4 '
                      />
                      : 
                      <PiEyeClosed size={16} color='#858585'/>
                      } 
                      </button>
          </div>

          {errors.password && (
           <span className="absolute left-2 text-red-500 text-xs">
           {errors.password.message}
            </span>
          )}
          </div>


         <button onClick={handleSubmit(handleSignUp)} disabled={BtnDisableSignUp} className={`${BtnDisableSignUp === true ? 'cursor-no-drop' : ''} hover:bg-black mt-6 hover:text-white border-[1px] border-[#858585] text-center py-2 px-4 rounded-lg font-medium text-black text-xs`} >Sign Up</button>
          <p className='text-center mt-2 text-gray-400 text-xs'>Already have account? <button onClick={() => setShowSignIn(true)} className='text-black font-bold'>SignIn</button></p>
          </div>
    </div>
     }

  </>
  );
}

export default Page