import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Image from 'next/image';
import { useForm } from "react-hook-form";
import { PiEyeClosed } from 'react-icons/pi';
import toast from 'react-hot-toast';

interface IFormInput {
    password:number;
  }

  const Server = process.env.NEXT_PUBLIC_SERVER
export default function ChildModal({closeModal, userDetails, allowEdit}) {
  const [open, setOpen] = React.useState(true);
  const [password, setPassword] = React.useState<string>('');
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [sending, setSending] = React.useState<boolean>(false) 
//   const handleOpen = () => {
//     setOpen(true);
//   };
  const handleClose = () => {
    closeModal(false)
    // setOpen(false);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();
  const handlePasswordCheck = async() => {
    setSending(true)
    const location = `${Server}/auth/login`;
    const settings = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        //   credentials: 'include',
        body: JSON.stringify({
            email: userDetails?.email,
            password: password,
        }),
    };
            let res:any = await fetch(location, settings);
            if(res.ok){
                res = await res?.json()
                toast.success('Verified', {position:'top-center'})
                setSending(false)
                allowEdit(true)
                handleClose()
            }else{
                res = await res?.json()
                toast.error(res?.message, {position:'top-center'})
                allowEdit(false)
                setSending(false)
                
            }
            setSending(false)     
  }


  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        {/* <Box sx={{ ...style, width: 400 }}> */}
        <Box className='w-[15rem] md:w-[25rem] bg-white p-4 rounded-md shadow-lg absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] '>
          <h2 id="child-modal-title" className='text-sm md:text-lg font-semibold '>Enter password to continue</h2>
          <hr className='my-2'/>
         
          <div id="child-modal-description" className='relative flex bg-[#eee] p-2 gap-2 items-center rounded-lg'>
                      <Image 
                      src={'/Vector.svg'}
                      alt='Vector'
                      width={20}
                      height={20}
                      />
                     <input 
                     value={password}
                     {...register("password", {
                        required: "Password is required",
                      })}
                      onChange={(e)=>setPassword
                     (e.target.value)} 
                     type={showPassword ? 'text' : 'password'} placeholder='Password' className={` w-[90%] overflow-hidden outline-none bg-transparent text-[#858585] placeholder:text-[#858585] placeholder:text-sm pt-1`} />
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
                     {errors.password && (
                     <span className="absolute left-14 text-red-500 text-xs">
                     {errors.password.message}
                     </span>
                     )}

                    <div className='mt-4 flex justify-end'>
                    <button disabled={sending} className={`${sending === true ? 'cursor-no-drop bg-gray-300 text-gray-400' : ' hover:bg-[#f2f2f2] '} text-[#005fc6] p-2 rounded-md`} onClick={handleSubmit(handlePasswordCheck)}>{sending ? 'Verifing' : 'Verify'}</button>
                    </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

// export default function NestedModal() {
//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => {
//     setOpen(true);
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <div>
//       <Button onClick={handleOpen}>Open modal</Button>
//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="parent-modal-title"
//         aria-describedby="parent-modal-description"
//       >
//         <Box sx={{ ...style, width: 400 }}>
//           <h2 id="parent-modal-title">Text in a modal</h2>
//           <p id="parent-modal-description">
//             Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
//           </p>
//           <ChildModal />
//         </Box>
//       </Modal>
//     </div>
//   );
// }