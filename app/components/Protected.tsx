"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {userStore} from '../Zustand/zustand'

const Protected = () => {
    const pathname = usePathname()
  const router = useRouter();
  const protectedRoutes = ["/user"]; // Specify protected routes here
  const auth = userStore((state) => state.authenticated);


  const fetchData = async() => {

    // let c = localStorage?.getItem("userToekn");
    // let isLoggedIn = false; // Declare isLoggedIn outside of the conditional blocks
    // if (c) {
    //   isLoggedIn = true;
    // }
    const currentRoute = pathname
    let a = window.location.href.split("/");
    let b = a[3];
    console.log(b);
    console.log("currentROute", a);
    if (protectedRoutes.includes(`/${b}`) && !auth) {
      router.push("/"); // Redirect to login page if accessing a protected route while not logged in
    }
  }

  useEffect(() => {
    fetchData()
  }, [pathname]);
  return (
    <>
      <div></div>
    </>
  );
};
export default Protected;