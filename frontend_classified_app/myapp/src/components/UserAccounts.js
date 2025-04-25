import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {getUsers} from "../slices/userSlice";
import { Link } from "react-router-dom";
import "../CSS/UserAccounts.css"

export default function UserAccounts(){

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(getUsers())
    },[dispatch])

    const {users, serverError} = useSelector((state)=>{
        return state.user;
    })


    return(<div className="user-accounts-container">

        <h2> User accounts</h2>
        {serverError ? <p>{serverError.msg}</p>:
        <>
        <table border={1}>
            <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
            </tr>
            </thead>
            <tbody>
            {/* here I'm trying to not display admin profile using filter */}
            {users.filter((ele) => ele.role !== "admin").map((ele)=>{ 
                return <tr key={ele._id}>
                    <td><Link to={`/user-account/${ele._id}`}>{ele.name}</Link></td>
                    <td>{ele.email}</td>
                    <td>{ele.role}</td>
                    <td>{ele.isActive ?<span style={{"color":"green"}}>Active</span>:<span style={{"color":"green"}}>Disabled</span>}</td>
                </tr>
            })}
            </tbody>
        </table>
        </>
        
        }
    </div>)
}