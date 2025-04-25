import { useSelector } from "react-redux";
// import user from '../config/store';
import "../CSS/Acoount.css"


export default function Account(){
    const {data} = useSelector((state)=>{
        return state.user
    })
     if(!data) return false //Dont show the component if data is not present
    console.log(data)
    return(<div className="account-card">
        <h2>Account</h2>
        <p>{data.name}</p>
        <p>{data.role}</p>
    </div>)
}