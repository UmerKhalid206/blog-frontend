'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {userStore} from '../Zustand/zustand'
import {useRouter} from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from 'react-hot-toast';
import { PiEyeClosed } from "react-icons/pi";
import Image from 'next/image';


interface IFormInput {
    email: string;
    otp: string;
    password:number;
    confirm_password:number
  }

const Page = () => {

  const Server = process.env.NEXT_PUBLIC_SERVER
    const router = useRouter();
    const decoded = userStore((state) => state.fetchDecoded);
    const {counter, init, cleanup} = userStore()

    const [auth, setAuth] = useState<boolean>(false)
    const [otpStatus, setOtpStatus] = useState<boolean>(false)
    const [otpTimeCounter, setOtpTimeCounter] = useState<boolean>(false)
    const [otpVerified, setOtpVerified] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [sending, setSending] = useState<boolean>(false)  
    const [reSending, setReSending] = useState<boolean>(false)  
    const [email, setEmail] = useState<string | null>(null)
    const [otp, setOtp] = useState<string | null>(null)
    const [counterValue, setCounterValue] = useState<number | null>(null)

    const checkLoggedIn = async() =>{
      const decoded_data = await decoded()
      if(decoded_data){
        setAuth(decoded_data.decoded.role)
        router.push('/')
      }
    }

    useEffect(() => {
        checkLoggedIn()
    },[])

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm<IFormInput>();
      const handleSendOtp:any = async( data:any) =>{
        setSending(true)
        const location = `${Server}/auth/generateOtp`;
        const settings = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            //   credentials: 'include',
            body: JSON.stringify({
              userEmail: email, 
            }),
        };

        // console.log(location, settings)
        let res:any = await fetch(location, settings)
        console.log('res', res)
        if(res.status === 201){
          res = await res.json()
          toast.success('Otp has been sent successfully', {position: 'top-center'})
          setSending(false)
          setOtpStatus(true)
          setOtpTimeCounter(true)
          cleanup()
          init()          //call the counter from zustand
        }else{
          res = await res.json()
          console.log('res in error', res)
          toast.error(`${res.message}, Otp not sent`, {position: 'top-center'})
          setSending(false)
        }
        console.log('res', res)
      }



      const handleVerifyOtp:any = async( data:any) =>{
        // return
        setSending(true)
        const location = `${Server}/auth/verifyOtp?code=${otp}`;
        const settings = {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            //   credentials: 'include',
            body: JSON.stringify({
              userEmail: email, 
            }),
        };

        // console.log(location, settings)
        let res:any = await fetch(location, settings)
        console.log('res', res)
        if(res.ok){
          res = await res.json()
          console.log('res', res)
          toast.success('Otp Verified Successfully', {position: 'top-center'})
          setOtpTimeCounter(true)
          setSending(false)
          setOtpVerified(true)
        }
        else{
          res = await res.json()
          console.log('res in error', res)
          toast.error(`${res.message}, Otp not Verified`, {position: 'top-center'})
          setSending(false)
        }
        // console.log('res', res)
        setSending(false)
      }




      const handleResend = async() => {
        if(!email){
          toast.error(`Email Field is empty`, {position: 'top-center'})
          return
        }
        setReSending(true)
        console.log('email', email)
        const location = `${Server}/auth/generateOtp`;
        const settings = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            //   credentials: 'include',
            body: JSON.stringify({
              userEmail: email, 
            }),
        };

        // console.log(location, settings)
        let res:any = await fetch(location, settings)
        console.log('res', res)
        if(res.status === 201){
          res = await res.json()
          toast.success('Otp has been Re-Sent to your email', {position: 'top-center'})
          setReSending(false)
          cleanup()
          init()
        }else{
          res = await res.json()
          console.log('res in error', res)
          toast.error(`${res.message}, Otp not sent`, {position: 'top-center'})
          setReSending(false)
        }
      }

      const handlePasswordChange:any = async( data:any) =>{
        if(data.password !== data.confirm_password){
          toast.error('Both Passwords must match together',{position: 'top-center'})
        return
        }


        setSending(true)
        const location = `${Server}/auth/changePassword?code=${otp}`;
        const settings = {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            //   credentials: 'include',
            body: JSON.stringify({
              userEmail: email, 
              password: data.confirm_password
            }),
        };

        // console.log(location, settings)
        let res:any = await fetch(location, settings)
        console.log('res', res)
        if(res.ok){
          res = await res.json()
          toast.success('Password Changed successfully', {position: 'top-center'})
          setSending(false)
          router.push('/signup')
        }else{
          res = await res.json()
          console.log('res in error', res)
          toast.error(`${res.message}`, {position: 'top-center'})
          setSending(false)
        }
        console.log('res', res)
      }

      const formatTime = (seconds:any) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
      };


  return (
    <div className='flex justify-center items-center min-h-[30vh]'>
        <div className='relative border shadow-md px-3 py-6 rounded-md mx-2  sm:w-[30rem]'>
          {otpVerified === true ? 
          <div className='flex justify-between items-center gap-4'>
          <h1 className='font-Baskervville text-sm sm:text-lg font-bold'>Change Password</h1>
          {otpTimeCounter === true ? 
        <div className='flex'>
          {counter < 0 ? 
        <h1 className='text-sm text-red-500'>Otp Expired</h1> 
        : 
        <div className='flex'>
        <h1 className='font-semibold relative mr-9 sm:mr-10 flex text-sm items-center'>OTP valid for:</h1><span className='text-red-500 absolute right-4 text-sm'>{formatTime(counter)}</span>
        </div>
        }
        </div>  
        : null}
          </div>
          :
          <div className='flex justify-between items-center gap-4'>
            <h1 className='font-Baskervville text-base md:text-lg font-bold'>{otpTimeCounter ===true ? 'Otp Verification': 'Enter your Email'}</h1>
            {otpTimeCounter === true ? 
          <div className='flex'>
            {counter < 0 ? 
          <h1 className=' text-red-500 '>Otp Expired</h1> 
          : 
          <div className='flex'>
          <h1 className='font-semibold relative mr-9 sm:mr-10 flex items-center text-sm sm:text-base'>Otp valid for:</h1><span className='text-red-500 absolute right-4 text-sm sm:text-base'>{formatTime(counter)}</span>
          </div>
          }
          </div>  
          : null}
            </div>
          }

            <hr className='my-2'/>
            {otpVerified === true ? 
            <p className='text-sm md:text-base my-2 text-[#858585]'>Provide New Password</p>
            : 
            <p className='text-sm md:text-base my-2 text-[#858585]'>{otpStatus === true ? 'Enter Your Otp' : 'Provide your email so we can send you an OTP'}</p>
            }

            {otpVerified === true ? 
            <div className='mt-4 flex flex-col justify-center items-center'>
              <div className='flex justify-between w-[70%] border rounded-md'>
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
          id='password'
          type={showPassword ? 'text' : 'password'} placeholder='New Password' className='w-[90%] text-sm text-[#858585] placeholder:text-[#858585] placeholder:text-sm  outline-none  mx-1 pl-2 py-2' />
          <div className='flex items-center mr-3'>
          <button onClick={() => setShowPassword(!showPassword)} className='hover:bg-gray-300 p-1 rounded-full'>
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
          </div>
           {errors.password && (
           <span className="absolute -mt-[4.4rem] md:left-[6.1rem] text-red-500 text-xs">
           {errors.password.message}
            </span>
          )}


              <div className='mt-4 flex justify-between w-[70%] border rounded-md'>
              <input 
          {...register("confirm_password", {
            required: "Confirm password is required",
            minLength: {
              value: 6,
              message: "Password must be 6 character long",
            },
            pattern: {
              value: /^(?=.*[!@#$%^&*])/, // Regex for at least one special character
              message: "Password must contain a special character",
            },
          })} 
          id='confirm_password'
          type={showConfirm ? 'text' : 'password'} placeholder='New Password' className='w-[90%] text-sm text-[#858585] placeholder:text-[#858585] placeholder:text-sm  outline-none  mx-1 pl-2 py-2' />
          <div className='flex items-center mr-3'>
          <button onClick={() => setShowConfirm(!showConfirm)} className='hover:bg-gray-300 p-1 rounded-full'>
          {showConfirm ===true ? 
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
          </div>
           {errors.confirm_password && (
           <span className="absolute mt-10 md:left-[6.1rem] text-red-500 text-xs">
           {errors.confirm_password.message}
            </span>
          )}

            <div className='mt-8 flex gap-2 justify-end w-[70%]'>
            <Link href={'/signup'} className='flex text-end mt-2 border py-1 px-2 rounded-md bg-[#e4e6eb] text-[#62666d] text-sm hover:text-black'>Cancel</Link>
            <button disabled={sending} onClick={handleSubmit(handlePasswordChange)} className={`${sending === true ? 'cursor-no-drop bg-gray-300 text-gray-400' : 'hover:bg-blue-600'} flex text-end mt-2 border py-1 px-2 rounded-md bg-blue-500 text-white text-sm `} >{sending === true ? 'Changing...' : 'Change'}</button>
            </div>

            </div>  
            :
          
            <div>
            {otpStatus === false ? 
           <div className='mt-4 flex flex-col justify-center items-center'>
            <input 
            {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Invalid email address',
                },
              })}
              id="email"
            type="email" onChange={(e)=>setEmail(e.target.value)} placeholder='Enter your Email' className='md:w-[70%] w-[90%] border text-sm text-[#858585] placeholder:text-[#858585] placeholder:text-sm  outline-none rounded-md px-2 pl-4 py-2'/>
            {errors.email && (
           <span className="absolute mt-6 left-[6.3rem] text-red-500 text-xs">
           {errors.email.message}
            </span>
          )}
            <div className='flex gap-2 justify-end w-[90%] md:w-[70%]'>
            <Link href={'/signup'} className='flex text-end mt-2 border py-1 px-2 rounded-md bg-[#e4e6eb] text-[#62666d] text-sm hover:text-black'>Cancel</Link>
            <button disabled={sending} onClick={handleSubmit(handleSendOtp)} className={`${sending === true ? 'cursor-no-drop bg-gray-300 text-gray-400' : 'hover:bg-blue-600'} flex text-end mt-2 border py-1 px-2 rounded-md bg-blue-500 text-white text-sm `} >{sending === true ? 'Sending...' : 'Send'}</button>
            </div>
            </div> 
            : 

            <div className='mt-4 flex flex-col justify-center items-center'>
            <input 
            onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
            {...register("otp", {
                required: "OTP is required",
                maxLength: {
                  value: 6,
                  message: 'Otp must be of 6 numbers'
                },
                minLength:{
                  value:6,
                  message: 'Otp must be of 6 numbers'
                }
              })}
              id="otp"
            type="number" onChange={(e)=>setOtp(e.target.value)} placeholder='Enter OTP' className='numberInput w-[90%] sm:w-[70%] border text-sm text-[#858585] placeholder:text-[#858585] placeholder:text-sm  outline-none rounded-md px-2 pl-4 py-2'/>
            {errors.otp && (
           <span className="absolute mt-6 left-[6.3rem] text-red-500 text-xs">
           {errors.otp.message}
            </span>
          )}
            <div className='flex gap-2 justify-end sm:w-[70%] w-[90%]'>
            <button disabled={sending}  onClick={handleSubmit(handleVerifyOtp)} className={`${sending === true ? 'cursor-no-drop bg-gray-300 text-gray-400' : 'hover:bg-blue-600'} flex text-end mt-2 border py-1 px-2 rounded-md bg-blue-500 text-white text-sm `}>{sending === true ? 'Verifing': 'Verify'}</button>
            </div>
            </div>
            }

            {otpStatus === true ? 
            <p className='mt-4 text-xs text-center'>Could not get it? <button onClick={handleResend} className='text-red-500'>Resend</button></p>
            : null }
          </div>
          }
        </div>


    </div>
  )
}

export default Page