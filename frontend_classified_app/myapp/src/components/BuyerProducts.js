import { useEffect } from "react";
import { getProducts } from "../slices/productSlice";
import { useDispatch,useSelector } from "react-redux";
import { getCategories } from "../slices/categorySlice";
import {enquiryForm} from "../slices/productSlice";
import {fetchUserAccount} from "../slices/userSlice";
import "../CSS/BuyerProduct.css"

export default function BuyerProducts(){

    const dispatch = useDispatch()

    const {productData} = useSelector((state)=>{
        return state.products;
    })
    const {data} = useSelector((state)=>{
        return state.category;
    })

    const user = useSelector((state)=>{
        return state.user
    })

    useEffect(()=>{
        dispatch(getProducts())
        dispatch(getCategories())
        dispatch(fetchUserAccount());
    },[dispatch])

    return(<div className="buyer-product-container">
        <h2>Products List </h2>
        <table border={1}>
            <thead>
                <th>SL. No.</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Description</th>
                <th></th>
                <th>Action</th>
                <th>Enquiries info.</th>
                
            </thead>
            <tbody>
                {productData.filter((ele) => ele.isApproved !== false).map((ele,i)=>{
                    const catObj = data.find((ele1)=>{
                        return ele1._id === ele.category 
                    })
                    return <tr key={ele._id}>
                        <td>{i=i+1}</td>
                        <td>{ele.name.toUpperCase()}</td>
                        <td>{ele.price}</td>
                        <td>{catObj? catObj.name.toUpperCase(): ""}</td>
                        <td>{ele.description}</td>
                        <td>{ele.images && (
                            <img 
                            src={`http://localhost:3031/uploads/${ele.images}`}                                 
                            alt={ele.name} 
                            width="30" 
                            />
                            )}</td>
                        <td><button onClick={()=>{
                            const result = window.prompt("Enter details");
                            console.log("result",result)
                            const enquiryFormData = {
                                ...ele,
                                message: result
                            }
                            if(result){
                                dispatch(enquiryForm(enquiryFormData))
                                window.alert(`Enquiry sent out for ${ele.name.toUpperCase()}` )
                            }
                        }}>Send Enquiry</button></td>
                        <td>
                            <ul>
                            {ele.enquires.filter((ele2)=> ele2.buyer === user.data._id).map((ele1)=>{
                                
                                return <li key={ele1._id}><p style={{"color":"purple"}}>{ele1.message}</p>-------------------------- <p style={{"color":"green"}}>{ele1.response ? ele1.response : <span style={{"color":"red"}}>Waiting for Seller response</span>}</p></li>
                            })}
                            
                            </ul>
                        </td>
                    </tr>
                })}
                
            </tbody>
        </table>
    </div>)
}