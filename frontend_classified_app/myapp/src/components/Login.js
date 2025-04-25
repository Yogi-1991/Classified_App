import { useState } from "react"
import {isEmail} from "validator";
import axios from "../config/axios";
import {useNavigate} from "react-router-dom";
import { useDispatch } from "react-redux";
import { logIn } from "../slices/userSlice";
import '../CSS/Login.css';

 

export default function Login(){
    const [formData, setFormData] = useState({
        email:"",
        password:"",
    });
    const [clientError, setclientError] = useState({});
    const [serverError, setServerError] = useState(null);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handleSubmit = async(e)=>{
        e.preventDefault();

        const error = {};

       
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

        
      
        if(Object.keys(error).length > 0){
            setclientError(error);
        }else{
            setclientError({});
            const formdetails = {
                email:formData.email,
                password: formData.password,
            }
            
            try{
                const response = await axios.post("/login",formdetails)
                console.log(response.data)
                localStorage.setItem("token", response.data.token)
                const userResponse = await axios.get('/account',{headers:{Authorization:localStorage.getItem('token')}});
                dispatch(logIn(userResponse.data))
                console.log(userResponse.data)
                navigate("/account")
            }catch(err){
            //     console.log(err.response.data.errors)
            //    setServerError(err.response.data.errors); 
               const errorData = err.response?.data?.errors;
                if (errorData) {
                     setServerError(errorData);
                     } else {
                     setServerError([{ msg: "Unknown error occurred" }]);
                 }

            }
        }
        

    }


    return(<div className="login-container">
        <h2>Login</h2>

        { serverError && (
                <div>
                    <h3 style={{color:"red", fontSize: "18px"}}>These error/s prohibited the form from being processed further.: </h3>
                    <ul>
                        { serverError.map((err, i) => {
                            return <li key={i}>{err.msg}</li>
                        })}
                    </ul>
                </div>  
            )}

        <form onSubmit={handleSubmit}>
       
            <div>
             <label htmlFor="email">Email</label>
            <input type="text" value={formData.email} id="email" onChange={(e)=>{
                setFormData({...formData,email:e.target.value})
            }}/><p style={{color:"red"}}>{clientError.email}</p></div><br/>
            <div>
            <label htmlFor="password">Password</label>
            <input type="password" value={formData.password} id="password" onChange={(e)=>{
                setFormData({...formData,password:e.target.value})
            }}/><p style={{color:"red"}}>{clientError.password}</p>
            </div><br/>
            
            <input type="submit" value="Login"/>
           
        </form>
      
    </div>)
}