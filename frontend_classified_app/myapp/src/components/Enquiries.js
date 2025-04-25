import { useEffect } from "react"
import { useDispatch,useSelector } from "react-redux";
import { getProducts } from "../slices/productSlice";
import {enquiryForm} from "../slices/productSlice";
import "../CSS/Enquiries.css"

export default function Enquiries(){

    const dispatch = useDispatch()

    const {productData,serverError} = useSelector((state)=>{
        return state.products;
    })
    

    useEffect(()=>{
        // if(productData.length > 0)
        dispatch(getProducts())
    },[dispatch])

 console.log("enq",productData)
    return(<div className="enquiries">
        <h2>Product Enquiries</h2>
        {serverError ? serverError.msg :
        <>
        <table border={1}>
            <thead>
                <th>Name</th>
                <th>Price💸</th>
                <th>Enquiries📝</th>
                <th>Views👀</th>
            </thead>
            <tbody>
                {productData.map((ele)=>{
                    return <tr key={ele._id}>
                        <td>{ele.name.toUpperCase()}</td>
                        <td>{ele.price}</td>
                        <td>
                            <ul>
                            {ele.enquires.map((ele1)=>{                              
                                 return <li key={ele1._id}><span style={{"color": "red"}}>{ele1.message}</span>:{ele1.response ? <p><span style={{"color": "green"}}>{ele1.response}</span></p>:<button onClick={()=>{
                                    const responsedetails = window.prompt("Enter Details")
                                    if(responsedetails){
                                        const respondObj ={
                                            ...ele1,
                                            response: responsedetails,
                                            buyerId: ele1.buyer,
                                            productID : ele._id
                                        }   
                                        dispatch(enquiryForm(respondObj));
                                    }
                                 }}>Respond</button>}</li>
                                                       
                        })}</ul>  </td>
                        <td>{ele.views}</td>
                    </tr>
                })}
            </tbody>

        </table>
        </>        
        }

    </div>)
}