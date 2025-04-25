import { useParams } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { useEffect,useState } from "react";
import { getProducts } from "../slices/productSlice";
import { getCategories } from "../slices/categorySlice";
import {isApproved} from "../slices/productSlice";
import "../CSS/ProductDetails.css"

export default function ProductDetails(){
    const [product, setProduct] = useState({});
    const [category,setCategory] = useState({});
    const {id} = useParams();
    const dispatch = useDispatch();

    useEffect(()=>{
        if(id){
            dispatch(getProducts());
            dispatch(getCategories());
        }
        
    },[])
    const {data} = useSelector((state)=>{
        return state.category
    })

    const {productData,serverError} = useSelector((state)=>{
        return state.products;
    })      
 
 useEffect(()=>{
    if (id && productData.length && data.length){
        const product = productData.find((ele)=>{
            return ele._id === id;        
        })  
        setProduct(product);
        const categoryName = data.find((ele)=>{
            return ele._id === product.category
        })
        console.log("category name",categoryName)
        setCategory(categoryName);
    }
        
 },[id, productData, data])
    

    return(<div className="product-containers">
        
        <h2>Product Details</h2>
        {serverError ? (<p>{serverError.msg}</p>) :
        <> 
        <p>Category: {category?.name}</p>
        <p>Name : {product.name}</p>
        <p>Description : {product.description}</p>
        <p>Price : {product?.price}</p>
       
        <button className={`product-details ${product.isApproved ? "reject":"approve"}`} onClick={()=>{
            const booleanValue = product.isApproved;
            const updateApproved = {
                ...product,
                isApproved: !booleanValue
            }
            dispatch(isApproved(updateApproved))
        }}>{product.isApproved ? "Reject":"Approve"}</button>        
        </>
        }              
         
    </div>)
}