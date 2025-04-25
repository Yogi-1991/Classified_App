
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const getCategories = createAsyncThunk('category/getCategories',async(_,{rejectWithValue})=>{
    try{
        const response = await axios.get('/category');
        console.log(response.data)
        console.log("getCategories executed")
        return response.data
    }catch(error){
        console.log(error);
        rejectWithValue({
            // mmsg : error.message,
            error: error.response.data.Error
        })
    }
})

 export const createCategory = createAsyncThunk('category/addCategory',async({newCategory,reset},{rejectWithValue})=>{
    try{
    const response = await axios.post('/category',newCategory,{headers:{Authorization: localStorage.getItem('token')}})
    console.log(response.data)
    console.log("addCategory executed")
    reset();
    return response.data;
    }catch(error){
        console.log(error);
        return rejectWithValue({
            message : error.message,
            error: error.response.data.Error
        })
    }
})

export const removeCategory = createAsyncThunk('category/removeCategory',async(id,{rejectWithValue})=>{
    try{
        const response = await axios.delete(`/category/${id}`,{headers:{Authorization:localStorage.getItem('token')}})
        console.log("Remove Cats",response.data);
        return response.data
    }catch(error){
        console.log(error)
        return rejectWithValue({
            msg : error.message,
            error: error.response.data.error
        })
    }
})

export const updateCategory = createAsyncThunk('category/updateCategory', async({editedCatObj,reset},{rejectWithValue})=>{
    console.log("check",editedCatObj)
        try{
            const response = await axios.put(`/category/${editedCatObj._id}`,editedCatObj,{headers:{Authorization:localStorage.getItem('token')}})
            console.log("editedAXios",response.data)
            reset()
            return response.data
            
        }catch(error){
           return  rejectWithValue({
                msg: error.message,
                error: error.response.data.Error
            })

        }
})

const categorySlice = createSlice({
    name : 'category',
    initialState: {
        data:[],
        editId: null,
        serverError: null
    },
    extraReducers:(builder)=>{
        builder.addCase(createCategory.fulfilled,(state,action)=>{
            state.data.push(action.payload);
            state.serverError = null;
        })
        builder.addCase(createCategory.rejected,(state,action)=>{
           state.serverError = action.payload;
         })


        builder.addCase(getCategories.fulfilled,(state,action)=>{
            state.data = action.payload;
        })
        builder.addCase(getCategories.rejected,(state,action)=>{
            state.serverError = action.payload;
        })

        
        builder.addCase(removeCategory.fulfilled, (state,action)=>{
             const index = state.data.findIndex((ele)=>{
                    return ele._id === action.payload._id
             })
             state.data.splice(index,1)
        })
        builder.addCase(removeCategory.rejected, (state,action)=>{
            state.serverError = action.payload;
        })


        builder.addCase(updateCategory.fulfilled, (state,action)=>{
            const index = state.data.findIndex((ele)=>{
                return ele._id === action.payload._id
            })
            state.data[index] = action.payload;
            state.editId = null;

        })
    },
    reducers:{
        makeEditId(state,action){
            state.editId = action.payload;
        }
    }
})

export const {makeEditId} = categorySlice.actions;
export default categorySlice.reducer;