import { create } from 'zustand'
import { jwtDecode } from "jwt-decode";
import { Interface } from 'readline';
import {toast} from 'react-hot-toast'
// const Server = 'http://localhost:3002'
const Server = 'https://blog-app-pi-lake.vercel.app'



function getDecodedToken() {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name === "jwtToken") {
            const decoded = jwtDecode(value);
            const data = {decoded, value}
            return data;
        }
    }
    return null; // Token not found
}

function deleteCookie(cookieName:any) {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

interface data {
    token:string
}

type CartStore = {
    user_data: {},
    authenticated: boolean,
    reaction: any,
    categoryId:any,
    categoryIdForBlog:any,
    imageUrl:any,
    newStatus:any,
    counter: any,
    intervalId:any,
    newData:boolean,
    Login: (email: String, password: String) => Promise<data>,
    SignUp: (data:any) => Promise<data>,
    fetchDecoded: () => Promise<any>,
    Logout: (value: boolean) => void,
    changeReaction: (value: any) => void,
    setCategoryId: (value: string) => void,
    setcategoryIdForBlog: (value: string) => void,
    setImageUrl: (value: string) => void,
    setStatus: (value: string) => void,
    refreshData: (value: boolean) => void,
    resetNewData: () => void,
    init:() => void,
    cleanup:() => void,
    // setImageUrl

    // Register: (formData: FormData) => Promise<void>
}

export const userStore = create<CartStore>((set, get) => ({
    counter: 0,
    intervalId: null, // To store the interval ID
    user_data: {},
    authenticated: false,
    categoryId: null,
    reaction: null,
    imageUrl: null, 
    categoryIdForBlog:null,
    newStatus: false,
    newData:false,

    Login: async (email, password) => {
        const location = `${Server}/auth/login`;

        const settings = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            //   credentials: 'include',
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        };
        try {
            const fetchResponse = await fetch(location, settings);
            // return fetchResponse;
            const data = await fetchResponse.json();
            if (fetchResponse.status === 201) {
                // Login successful, store the token (assuming it's in the 'token' property of the response)
                const token = data.token;
                // Store the token in a cookie or local storage
                document.cookie = `jwtToken=${token}; path=/`; // Example using a cookie
                // You might also want to store it in local storage
                // localStorage.setItem('jwtToken', token);
                // await get().fetchUser()
                set({authenticated: true})
                return data;
            }else{
                console.log(data);
                toast.error(data?.message, {position: 'top-right'})
                return data;
            }
        } catch (e) {
            console.log("in error statement...");
            return e;
        }
    },

    SignUp: async (data) => {
        const location = `${Server}/auth/signup`;

        const settings = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            //   credentials: 'include',
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                role: data.role,
                password: data.password,
            }),
        };
        try {
            const fetchResponse = await fetch(location, settings);
            // return fetchResponse;
            const data = await fetchResponse.json();
            if (fetchResponse.status === 201) {
                // Login successful, store the token (assuming it's in the 'token' property of the response)
                const token = data.token;
                // Store the token in a cookie or local storage
                document.cookie = `jwtToken=${token}; path=/`; // Example using a cookie
                // You might also want to store it in local storage
                // localStorage.setItem('jwtToken', token);
                // await get().fetchUser()
                set({authenticated: true})
                return data;
            }else{
                console.log(data);
                toast.error(data?.message, {position: 'top-right'})
                return data;
            }
        } catch (e) {
            console.log("in error statement...");
            return e;
        }
    },

    fetchDecoded: async () =>{
        // const decoded = getDecodedToken();
        // return decoded
        const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name === "jwtToken") {
            const decoded = jwtDecode(value);
            const data = {decoded, value}
            set({authenticated: true})
            return data;
        }
    }
    return null;
    },

    setCategoryId: (value) => {
        set({categoryId: value})
    },

    setcategoryIdForBlog: (value) => {
        set({categoryIdForBlog: value})
    },

    changeReaction: (value) => {
        set({reaction: value})
    },

    setImageUrl: (value) => {
        set({imageUrl: value})
    },

    setStatus: (value) => {
        set({newStatus: value})
    },

    Logout: (value) => {
        deleteCookie('jwtToken')
        set({authenticated: value})
         
    },

  
  init: () => {
    set({counter: 300})
    const intervalId = setInterval(() => {
      set((state) => ({ counter: state.counter - 1 }));
    }, 1000); // 1000 milliseconds = 1 second

    // Store the interval ID
    set({ intervalId });
  },

  cleanup: () => {
    const { intervalId } = get();
    clearInterval(intervalId);
  },

  refreshData: (value) => {
    set({newData: value})
},

resetNewData: () => {
    set({newData: false})
},
    
}))