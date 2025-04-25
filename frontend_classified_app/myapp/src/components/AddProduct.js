import { useEffect, useState } from "react";
import { getProducts } from "../slices/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../slices/categorySlice";
import { createProduct } from "../slices/productSlice";
import { removeProduct } from "../slices/productSlice";
import { makeEditId } from "../slices/productSlice";
import {updateProduct} from "../slices/productSlice";
import "../CSS/AddProduct.css"

export default function AddProduct(){
    const [formdata, setFormdata] = useState({
        name: "",
        price:"",
        description:"",
        category:"",
        image: null
    })
    const [clientError,setclientError] = useState({})

    const dispatch = useDispatch();

    const {productData,editId, serverError} = useSelector((state)=>{
        return state.products
    })

    const {data} = useSelector((state)=>{
        return state.category;
    })

  
    useEffect(()=>{
        dispatch(getProducts())
        dispatch(getCategories())
            console.log("get pro",productData)
    },[dispatch])

    useEffect(()=>{
        if(editId){
            const editProduct = productData.find((ele)=>{
                return ele._id === editId
            })
            setFormdata({...formdata,
                name:editProduct.name,
                price:editProduct.price,
                description: editProduct.description,
                category: editProduct.category 
              })
        }
       
    },[editId,productData])

    

    const handleSubmit = (e)=>{
        e.preventDefault();

        const error = {}

        if(isNaN(formdata.price)){
            error.price = " Input should be number"
        }

        const reset = ()=>{
            setFormdata({...formdata,
                    name: "",
                    price:"",
                    description:"",
                    category:"",
                    image:""
            })
        }
       
        if(Object.keys(error).length > 0){
            setclientError(error)
        }else{

            if(editId){  
                console.log("editID",editId) 
                const editedProduct = new FormData();
                // editedProduct.append('._id',editId)
                editedProduct.append('name',formdata.name)
                editedProduct.append('price',formdata.price)
                editedProduct.append('description',formdata.description)
                editedProduct.append('category',formdata.category)
                editedProduct.append('image',formdata.image)
                
                // edited object if  we work with text/data
                // const editedProduct = {
                //     _id: editId,
                //     name: formdata.name,
                //     price:formdata.price,
                //     description:formdata.description,
                //     category:formdata.category
            // }
            dispatch(updateProduct({_id:editId,editedProduct,reset}))
            }else{
                setclientError({})
            const newProduct = new FormData()
            newProduct.append('name',formdata.name)
            newProduct.append('price',formdata.price)
            newProduct.append('description',formdata.description)
            newProduct.append('category',formdata.category)
            newProduct.append('image',formdata.image)

            //Below line of code if we only work text/data
            // const newProduct = {
            //     name: formdata.name,
            //     price:formdata.price,
            //     description:formdata.description,
            //     category:formdata.category
            // }
            dispatch(createProduct({newProduct,reset}))
            }            
        } 
        
    }
    console.log("error in editing",serverError)

    
    return(<div  className="product-container">
        <h2>Product Listing: {productData.length}</h2>
        <table className="product-table" border={1}>
            <thead>
                <tr>
                <th>Name</th>
                <th>Image</th>
                <th>❌ </th>
                <th>✏️</th>
                </tr>
            </thead>
            <tbody>
                {productData.map((ele1)=>{
                  return <tr key={ele1._id}>
                        <td>{ele1.name.toUpperCase()} </td>
                        <td>{ele1.images && (
                            <img 
                                src={`http://localhost:3031/uploads/${ele1.images}`}                                 
                                alt={ele1.name} 
                             width="30" 
                            />
                        )}</td>
                        <td><button className="remove-btn" onClick={()=>{
                    dispatch(removeProduct(ele1._id));
                }}>Remove</button></td>
                <td><button className="edit-btn" onClick={()=>{
                    dispatch(makeEditId(ele1._id))                    
                }}>Edit</button></td>
                  </tr>
                })}
                
            </tbody>
        </table>

        {/* <ul>
            {productData.map((ele)=>{
                return <li key={ele._id}>{ele.name}<button onClick={()=>{
                    dispatch(removeProduct(ele._id));
                }}>Remove</button><button onClick={()=>{
                    dispatch(makeEditId(ele._id))                    
                }}>Edit</button></li>
            })}
        </ul> */}
        <div className="Product-form-container">
        <h2>{editId ? "Edit": "Add"} Product</h2>
        {serverError && serverError.msg}
        <form className="product-form" onSubmit={handleSubmit}>
        <label htmlFor="name" >Name</label>
        <input type="text" id="name" value={formdata.name} onChange={(e)=>{
            setFormdata({...formdata,name:e.target.value})
        }} required />
        <label htmlFor="price" >Price</label>
        <input type="text" id="price" value={formdata.price} onChange={(e)=>{
            setFormdata({...formdata,price:e.target.value})
        }} required /><span>{clientError.price}</span>
        <label htmlFor="description" >Description</label>
        <textarea  id="description" value={formdata.description} onChange={(e)=>{
            setFormdata({...formdata,description:e.target.value})
        }} required />
        <label htmlFor="category">Category</label>
        <select value={formdata.category} id="category" onChange={(e)=>{
            setFormdata({...formdata,category:e.target.value})
        }}required >
            <option value="">Select</option>
            {data.map((ele)=>{
                return <option key={ele._id} value={ele._id}>{ele.name.toUpperCase()}</option>
            })}
        </select>
         <input type="file" id="img" onChange={(e)=>{
            setFormdata({...formdata, image:e.target.files[0] })
         }}
         accept="image/*"
         />
       
       
        <br/><input className="submit-btn"  type="submit"/>
        </form>
        </div>
    </div>)
}