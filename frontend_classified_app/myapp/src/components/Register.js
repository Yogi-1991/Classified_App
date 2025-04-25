import { useState } from "react"
import {isEmail} from "validator";
import axios from "../config/axios";
import {useNavigate} from "react-router-dom"
import "../CSS/Login.css"

export default function Register(){
    const [formData, setFormData] = useState({
        name:"",
        email:"",
        password:"",
        role:""
    });
    const [clientError, setclientError] = useState({});
    const [serverError, setServerError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault();

        const error = {};

        if(formData.name.trim() === ""){
            error.name =  "Name field is empty";    
        }
        if(formData.email.trim() ===""){
            error.email = "Email field is empty";
        }else if(!isEmail(formData.email)){
            error.email = "Invalid email"
        }
        if(formData.password.trim() ===""){
            error.password = "Password field is empty";
        }else if(formData.password.trim().length < 8 || formData.password.trim().length >128){
            error.password = "password should be between 8 to 128 characters"
        }

        if(formData.role ===""){
            error.role = "Select the role";
        }
      
        if(Object.keys(error).length > 0){
            setclientError(error);
        }else{
            setclientError({});
            const formdetails = {
                name:formData.name,
                email:formData.email,
                password: formData.password,
                role:formData.role
            }
            
            try{
                const response = await axios.post("/register",formdetails)
                console.log(response.data)
                navigate("/login")
            }catch(err){
                console.log(err.response.data.errors)
               setServerError(err.response.data.errors); 

            }
        }
        

    }


    return(<div className="register-wrapper">
         <div className="register-card">
        <h2>Register</h2>

        { serverError && (
                <div>
                    <h3>These error/s prohibitted the form from being saved: </h3>
                    <ul>
                        { serverError.map((err, i) => {
                            return <li key={i}>{err.msg}</li>
                        })}
                    </ul>
                </div> 
            )}

        <form onSubmit={handleSubmit}>
            <div className="register-form">
            <label htmlFor="name">Name</label> {/*htmlFor attribute used to focuts contacted input field*/}
            <input type="text" value={formData.name} id="name" onChange={(e)=>{
                setFormData({...formData,name:e.target.value})
            }}/><p style={{color:"red"}}>{clientError.name}</p></div><br/>
            <div>
             <label htmlFor="email">Email</label>
            <input type="text" value={formData.email} id="email" onChange={(e)=>{
                setFormData({...formData,email:e.target.value})
            }}/><p style={{color:"red"}}>{clientError.email}</p></div><br/>
            <div>
            <label htmlFor="password">Password</label>
            <input type="text" value={formData.password} id="password" onChange={(e)=>{
                setFormData({...formData,password:e.target.value})
            }}/><p style={{color:"red"}}>{clientError.password}</p>
            </div><br/>
            <div className="radio-group">
            {/* <label style={{ fontSize: "18px", fontWeight: "bold" }}>Role</label><br/> */}
            <input type="radio" checked={formData.role==="admin"} onChange={()=>{
                setFormData({...formData,role:"admin"})
            }}/><label>Admin</label>
            <input type="radio"  checked={formData.role==="seller"} onChange={()=>{
                setFormData({...formData,role:"seller"})
            }}/><label>Seller</label>
            <input type="radio"  checked={formData.role==="buyer"} onChange={()=>{
                setFormData({...formData,role:"buyer"})
            }}/><label>Buyer</label><p style={{color:"red"}}>{clientError.role}</p><br/>
            </div>
            <input type="submit" value="Register"/>
           
        </form>
        </div>
    </div>)
}