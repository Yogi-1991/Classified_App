import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux";


export default function PrivateRoute(props){

    const {data} = useSelector((state)=>{
        return state.user;
    })

    if(localStorage.getItem("token") && data){  
        return props.children;// Caheck token as well as user data
    }else if(localStorage.getItem("token")&& !data){
        return false;//token present data not available meaning user has reloaded the page
    }else{
        <Navigate to="/login"/>//user not logged in , but trying to access the page

    }

}