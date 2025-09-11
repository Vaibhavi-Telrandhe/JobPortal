import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from"react-router-dom";


const ProtectedRoute = ({ children }) => {
    const {user}=useSelector(store=>store.auth);
    const navigate=useNavigate();
    useEffect(()=>{
        if(used===null || user.role!=='recruiter')
            {
                navigate("/")
            }
    },[]);
    return(
        <>
        {children}
        </>
    )
};
export default ProtectedRoute;