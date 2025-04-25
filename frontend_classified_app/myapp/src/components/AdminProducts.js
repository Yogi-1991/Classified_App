import { useEffect } from "react"
import { useSelector,useDispatch } from "react-redux"
import { getProducts } from "../slices/productSlice";
import {Link} from "react-router-dom";
import "../CSS/AdminProduct.css"

export default function AdminProducts(){
    const dispatch = useDispatch();
    const {productData} = useSelector((state)=>{
        return state.products
    })
    useEffect(()=>{
        dispatch(getProducts())
        console.log("Admin",productData)
    },[dispatch])

    

    return(<div className="admin-products-container">
       
        {productData.length >0 ?
        <>
         <h2 className="admin-heading">Products List : {productData.length}</h2>
        <table className="product-table" border={1}>
            <thead>
            <th>Sl. No.</th>
            <th>Name</th>
            <th>Approved Status</th>
            </thead>
            <tbody>
            {productData.map((ele,i)=>{
            return  <tr key={ele._id}>
                        <td>{i+1}</td>
                        <td><Link className="product-link" to={`/product-details/${ele._id}`}>{ele.name.toUpperCase()}</Link></td>
                        <td className={ele.isApproved ? "approved" : "not-approved"}>{ele.isApproved ? "Yes" : "No"}</td>
                    </tr>                         
            })}
            </tbody>
        </table>
        </>
        : <h2 style={{"color": "red"}} className="no-products">"No Product listed" </h2>   
    }
        

    </div>)
}