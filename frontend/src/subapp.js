import { useEffect } from "react";
import AppLayout from "./components/AppLayout";

const Subapp = () => {
    useEffect(() => {
        if (!localStorage.getItem('user')) {
            alert('Please Login Your Account');
            window.location.href = '/login';
        }
    }, []);

    const Makelogout = () => {
        window.location.href = "/logout";
    };

    return (
        <AppLayout>
            <div className="flex flex-col items-center w-full pt-10">
                <img src="./image/5.jpeg" className="w-9/12" alt="" height="900" width="1200" />    
            </div>

            <button onClick={Makelogout} className="absolute top-0 right-0 mt-4 mr-4" style={{ backgroundColor: '#FCD12A', borderRadius: '5px' }}>LOGOUT</button>

        </AppLayout>
    );
};

export default Subapp;
