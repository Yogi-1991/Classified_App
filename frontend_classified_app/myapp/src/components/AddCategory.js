import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../slices/categorySlice";
import { createCategory } from "../slices/categorySlice";
import {removeCategory} from "../slices/categorySlice";
import { makeEditId } from "../slices/categorySlice";
import {updateCategory} from "../slices/categorySlice";
import "../CSS/AddCategory.css";


export default function AddCategory(){
   const [categoryName, setCategory] = useState("");
   const [clientError, setClientError] = useState({});

   const dispatch = useDispatch();

   const {data, editId, serverError} = useSelector((state)=>{
    return state.category;
})

   useEffect(()=>{
    dispatch(getCategories())
    if(editId){
        const editCat = data.find((ele)=>{
            return ele._id === editId;
        })
        setCategory(editCat.name)
    }
    
    },[dispatch,editId])  

    useEffect(() => {
        if (serverError) {
            window.alert(serverError.error || serverError.msg || "Something went wrong");
        }
    }, [serverError]);

   

    const handleSubmit = (e)=>{
        e.preventDefault()
        const error = {}

        if(categoryName === ""){
            error.category = "Category details Empty";
        }

        const reset = ()=>{
            setCategory("");
        }

        if(Object.keys(error).length > 0){
            setClientError(error)
        }else{
            if(editId){
               const editedCat =  data.find((ele)=>{
                    return ele._id === editId
                })
                const editedCatObj = {...editedCat, name:categoryName}
                console.log("edited",editedCatObj)
                dispatch(updateCategory({editedCatObj,reset}))
            }else{
                setClientError({})
            const newCategory = {
                name : categoryName
            }
            
            dispatch(createCategory({newCategory,reset}));
            }
            
        }

    }

    return(<div className="category-container">
        <h2>Category List :{data.length}</h2>

        <table border={1}>
            <thead>
                <th>Name</th>
                <th>❌ </th>
                <th>✏️</th>
            </thead>
            <tbody>
                {data.map((ele)=>{
                  return  <tr key={ele._id}>
                        <td>{ele.name.toUpperCase()}</td>
                        <td><button title="Remove Category" onClick={()=>{
                    dispatch(removeCategory(ele._id))
                }}>Remove</button></td>
                <td><button itle="Edit Category" onClick={()=>{
                    dispatch(makeEditId(ele._id))
                }}>Edit</button></td>
                    </tr>
                })}
                
            </tbody>
        </table>
        {/* <ul className="category-list">
            {data.map((ele)=>{
                return <li key={ele._id}>{ele.name}<button onClick={()=>{
                    dispatch(removeCategory(ele._id))
                }}>Remove</button><button onClick={()=>{
                    dispatch(makeEditId(ele._id))
                }}>Edit</button></li>
            })}
        </ul> */}
        {}
        <h2>{editId ? "Edit" : "Add" } Category</h2>
        {clientError && <p className="error-msg" style={{'color':'red'}}>{clientError.category}</p>}
        <form className="category-form" onSubmit={handleSubmit} >
            <input type="text" placeholder="Enter the Category" value={categoryName} onChange={(e)=>{
                setCategory(e.target.value);
            }}/><br/>
            <input type="submit"/>
        </form>
    </div>)
}