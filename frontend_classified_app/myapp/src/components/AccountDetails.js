import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {getUsers} from '../slices/userSlice';
import {updateActivate} from '../slices/userSlice';
import "../CSS/AccountDetails.css";


export default function AccountDetails(){

   const [userDetails, setUserDetails]=useState({});
 
    const {id} = useParams();

    const dispatch = useDispatch()

    const {users,serverError} = useSelector((state)=>{
        return state.user;
    })

    useEffect(()=>{
        if(id){
            dispatch(getUsers());               
        }
    },[id,dispatch])

   

    useEffect(()=>{
        if(id && users.length>0){
            const singledetails = users.find((ele)=>{
                return ele._id === id;
            })
            setUserDetails(singledetails);
        }
    },[id,users])

    return(<div className="account-details">
        <h2>User details</h2>
        {serverError ? serverError.msg :
        <>
         <p>Name: {userDetails.name}</p>
         <p>Email: {userDetails.email}</p>
         <p>Role: {userDetails.role}</p>
         <button className={`account-detail ${userDetails.isActive ? "deactivate" : "activate"}`} onClick={()=>{
            const boleanValue = userDetails.isActive
            const updateActivateObj ={
                ...userDetails,
                isActive: !boleanValue
            }
           dispatch(updateActivate(updateActivateObj))
            console.log("IsACtivate clicked")
         }}>{userDetails.isActive? "De-Activate" : "Activate"}</button>
        </>
        
        }
    </div>)
}