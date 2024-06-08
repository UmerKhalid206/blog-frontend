import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Image from 'next/image';
import { PiEyeClosed } from 'react-icons/pi';
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import ChildModal from './Password';
import {userStore} from '../Zustand/zustand'

interface IFormInput {
    password:number;
    profile:string
  }

  const Server = process.env.NEXT_PUBLIC_SERVER

export default function EditProfile({closeModal, profileData, refreshOnUpdate}:any) {
  console.log('profileData', profileData)
  const [open, setOpen] = React.useState<boolean>(true);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('body');
  
  const [name, setName] = React.useState<string>(profileData?.name);
  const [profileSummary, setProfileSummary] = React.useState<string>(profileData?.profileSummary);
  const [password, setPassword] = React.useState<any>(null);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [imagePreview, setImagePreview] = React.useState<string | ArrayBuffer | null>();
  const [imageFile, setImageFile] = React.useState<any>();

  const decoded = userStore((state) => state.fetchDecoded);

  const [infoEdit, setInfoEdit] = React.useState<boolean>(false);
  const [isHovered, setHovered] = React.useState<boolean>(false);
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [updating, setUpdating] = React.useState<boolean>(false) 


  const handleChildModal = () => {
    setOpenModal(openModal => !openModal)
    // setInfoEdit(!infoEdit)
  }

  const closeChildModal = (value:boolean) => {
    setOpenModal(value)
  }

  const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    // setOpen(false);
    closeModal(false)
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();

  // const handleUpdateProfile = async() => {
  //   const decoded_data = await decoded()
  //   const data = new FormData();
  //   data.append('file', imageFile);
  //   data.append('name', name)
  //   data.append('password', password)

  //   console.log('data', data)

  //   console.log('name', name)
  //   console.log('password', password)
  //   console.log('imageFile', imageFile)

  //   const token = decoded_data.value
  //           const settings = {
  //               method: "PATCH",
  //               headers: {
  //                   // 'Content-Type': 'application/json',
  //                   Authorization: `Bearer ${token}`,
  //               },
  //               body: data 
  //           };

   
  // }

  const handleUpdateProfile = async () => {

    setUpdating(true)
    const decoded_data = await decoded();
    const data = new FormData();
  
    // Ensure that imageFile, name, and password have valid values
    console.log('name', name);
    console.log('password', password);
    console.log('imageFile', imageFile);
  
    if(imageFile){
      data.append('file', imageFile);
      data.append('image_url', profileData?.image_url)
    }
    if(name !== profileData?.name){
      data.append('name', name);
    }
    if(profileSummary){
      data.append('profileSummary', profileSummary)
    }
    if(password){
      data.append('password', password);
    }
  
    console.log('Data appended to FormData:', data);
  
    const token = decoded_data.value;
    const settings = {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    };

    console.log('settings',settings )
    let res:any = await fetch(`${Server}/auth/updateProfile`, settings)
    if(res.ok){
      toast.success('Profile Updated Successfully')
      setUpdating(false)
      refreshOnUpdate(true)
      handleClose()
    }else{
      res = await res?.json()
      toast.error(res?.message)
      setUpdating(false)
    }
    setUpdating(false)
  };
  

  const handleInfoEdit = () => {
    setInfoEdit(!infoEdit)
  }

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const disAllowEdit = () => {
    setInfoEdit(!infoEdit)
  };

  const handleFileChange = (event:any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file) {

      const fileType = file.type;
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

      if (allowedTypes.includes(fileType)) {

        reader.onloadend = () => {
          setImagePreview(reader.result);
        };

        reader.readAsDataURL(file);
        setImageFile(file)
      } else {
        toast.error('Please upload a .png, .jpg, or .jpeg file.',{position: 'top-center'})
        event.target.value = null;
      }
    }
  };

  const allowEdit = (value:boolean) => {
    setInfoEdit(value)
  }

  return (
    <React.Fragment>
      {/* <Button onClick={handleClickOpen('paper')}>scroll=paper</Button>
      <Button onClick={handleClickOpen('body')}>scroll=body</Button> */}
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth
      >
        {/* <div className='w-[50rem]'> */}
        <DialogTitle id="scroll-dialog-title">

           <div className='flex items-center justify-center'>
        <h1 className='text-lg font-bold'>Edit Profile</h1>
        <button onClick={handleClose} className='absolute right-4 p-2 rounded-full hover:bg-[#e4e6eb]'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="text-[#606770] w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
        </button>
        </div> 
            
        </DialogTitle>
        <hr />
        <DialogContent dividers={scroll === 'paper'}
        >
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <div className='text-black'>
                <div>
                    <div className='flex justify-between items-center'>
                    <h1 className='text-lg font-bold'>Profile picture</h1>
                    {infoEdit ? 
                    <button onClick={disAllowEdit} className='text-red-500 p-2 hover:bg-[#f2f2f2] rounded-full'>
                      Close
                    </button>
                    : 
                    <button onClick={handleChildModal} className='text-[#005fc6] p-2 hover:bg-[#f2f2f2] rounded-md'>Edit</button>
                    }
                    </div>
                  <div className='my-4 flex justify-center'>
                  <div
                    className='relative'
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {imagePreview ? 
                    <Image
                      src={imagePreview}
                      alt='profile pic'
                      width={500}
                      height={500}
                      className={`w-40 h-40 rounded-full ${isHovered ? 'opacity-40 ' : ''}`}
                    />
                    :
                    <Image
                    src={profileData?.image_url || '/Profile_Picture.png'}
                    alt='profile pic'
                    width={500}
                    height={500}
                    className={`w-40 h-40 rounded-full ${infoEdit && isHovered ? 'opacity-40' : ''}`}
                    />
                  }

                  {infoEdit === true ? 
                  <div>
                    {isHovered && (
                      <label className="border absolute inset-0  rounded-full z-50 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1  ">
                        
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-8 h-8">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                        <input onChange={handleFileChange} type="file" accept=".png, .jpg, .jpeg" className="hidden"/>
                        
                      
                      </label>
                    )}
                    </div>
                    : null }
                  </div>
                  </div>

                    <div className='flex justify-between'>
                    <h1 className='text-lg font-bold'>Info</h1>
                    {/* <button onClick={handleChildModal} className='text-[#005fc6] p-2 hover:bg-[#f2f2f2] rounded-md'>Edit</button> */}
                    </div>

                    {openModal ? 
                    <ChildModal closeModal={closeChildModal} userDetails={profileData} allowEdit={allowEdit}/>
                    : null}

                    <div className='mt-4 flex flex-col gap-3'>
                    <div className='flex bg-[#eee] p-2 gap-2 items-center rounded-lg '>
                      <Image 
                      src={'/user_1.svg'}
                      alt='user_1.svg'
                      width={20}
                      height={20}
                      />
                      <input disabled={!infoEdit} value={name} onChange={(e)=>setName(e.target.value)} type="text" id="name"
                      placeholder='Name' className={`${infoEdit === false ? 'cursor-no-drop  text-gray-400/80 placeholder:text-gray-400/80' : ''} w-[90%] overflow-hidden outline-none bg-transparent text-[#858585] placeholder:text-[#858585] placeholder:text-sm pt-1`}/>
                      </div>

                    <div className='flex bg-[#eee] p-2 gap-2  rounded-lg '>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#858585]">
                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                    <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                    </svg>


                      <textarea 
                      {...register("profile", {
                        maxLength: {
                          value: 350,
                          message: "Summaray cannot be more than 350 characters",
                        },
                        
                      })}
                      onChange={(e)=>setProfileSummary(e.target.value)}
                      disabled={!infoEdit}   id="profile"
                      value={profileSummary}
                      placeholder='Profile Summary' className={`${infoEdit === false ? 'cursor-no-drop  text-gray-400/80 placeholder:text-gray-400/80' : ''} w-full overflow-hidden outline-none bg-transparent text-[#858585] placeholder:text-[#858585]  pt-1`}/>
                      </div>
                      {errors.profile && (
                     <span className="absolute mt-[7.6rem] left-16 text-red-500 text-xs">
                     {errors.profile.message}
                     </span>
                     )}

                      <div className='flex bg-[#eee] p-2 gap-2 items-center rounded-lg'>
                      <Image 
                      src={'/Vector.svg'}
                      alt='Vector'
                      width={20}
                      height={20}
                      />
                     <input 
                     value={password}
                     {...register("password", {
                        minLength: {
                          value: 6,
                          message: "Password must be 6 character long",
                        },
                        pattern: {
                          value: /^(?=.*[!@#$%^&*])/, // Regex for at least one special character
                          message: "Password must contain a special character",
                        },
                      })}
                      disabled={!infoEdit} 
                      onChange={(e)=>setPassword
                     (e.target.value)} 
                     type={showPassword ? 'text' : 'password'} placeholder='New Password' className={`${infoEdit === false ? 'cursor-no-drop  text-gray-400/80 placeholder:text-gray-400/80' : ''} w-[90%] overflow-hidden outline-none bg-transparent text-[#858585] placeholder:text-[#858585]  pt-1`} />
                     
                     {infoEdit === true? 
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
                      : null }
                     </div>
                     {errors.password && (
                     <span className="absolute mt-[6rem] left-16 text-red-500 text-xs">
                     {errors.password.message}
                     </span>
                     )}

                    </div>
                </div>
            </div>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button disabled={updating} className={`${updating === true ? 'cursor-no-drop bg-gray-300 text-gray-400' : ' hover:bg-[#f2f2f2] '} text-[#005fc6] p-2 rounded-md`} onClick={handleSubmit(handleUpdateProfile)}>{updating ? 'Updating' : 'Update'}</button>
          
        </DialogActions>
        {/* </div> */}
      </Dialog>
    </React.Fragment>
  );
}