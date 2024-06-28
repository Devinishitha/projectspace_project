import { useEffect } from "react";

function Logout(){
    useEffect(()=>{
        localStorage.removeItem('user')
        window.location.href='/login'
    })
}

export default Logout;