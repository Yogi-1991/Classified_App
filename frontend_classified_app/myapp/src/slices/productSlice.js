
import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const getProducts = createAsyncThunk('product/getProducts', async(_,{rejectWithValue})=>{
    try{
        const response = await axios.get('/products',{headers:{Authorization:localStorage.getItem('token')}})
        console.log("get prodcut axios",response.data);
        return response.data;
    }catch(error){
        return rejectWithValue({
            msg: error.message,
            error: error.response.data.Error
        })
    }

})


export const createProduct = createAsyncThunk('products/createProduct',async({newProduct,reset},{rejectWithValue})=>{
    try{

        const response = await axios.post('/product',newProduct, {headers:{Authorization:localStorage.getItem('token')}})
        console.log(response.data);
        reset();
        return response.data
    }catch(error){
        return rejectWithValue({
            msg: error.message,
            error: error.response.data.Error
        })

    }
})

export const removeProduct = createAsyncThunk('products/removeProduct',async(id,{rejectWithValue})=>{
    try{
        const response = await axios.delete(`/product/${id}`,{headers:{Authorization:localStorage.getItem('token')}})
        console.log(response.data);
        return response.data
    }catch(error){
        return rejectWithValue({
            msg : error.message,
            error: error.response.data.Error
        })

    }
})

export const updateProduct = createAsyncThunk('products/updateProduct',async({_id,editedProduct,reset},{rejectWithValue})=>{
    try{
        const response = await axios.put(`/product/${_id}`,editedProduct,{headers:{Authorization:localStorage.getItem('token')}});
        console.log(response.data);
        reset();
        return response.data;
    }catch(error){
        return rejectWithValue({
            msg:error.message,
            error: error.response.data.Error
        })
    }
})

export const isApproved = createAsyncThunk('products/isApproved',async(updateApproved,{rejectWithValue})=>{
    try{
        const response = await axios.put(`/approveProduct/${updateApproved._id}`,updateApproved,{headers:{Authorization:localStorage.getItem('token')}})
        return response.data

    }catch(error){

    }
})

export const enquiryForm = createAsyncThunk('products/enquiryForm',async(enquiryFormData,{rejectWithValue})=>{
    try{
        const response = await axios.put(`/enquries/${enquiryFormData._id}`,enquiryFormData, {headers:{Authorization:localStorage.getItem('token')}})
        console.log("enquiry",response.data);
        return response.data;
    }catch(error){
        return rejectWithValue({
            msg:error.message,
            error: error.response.data.Error
        })

    }
})

const productSlice = createSlice({
    name: 'products',
    initialState:{
        productData : [],
        editId : null,
        serverError: null
    },
    extraReducers: (builder)=>{
        builder.addCase(getProducts.fulfilled,(state,action)=>{
            state.productData = action.payload;
            console.log("slice",state.productData)
        })

        builder.addCase(createProduct.fulfilled,(state,action)=>{
            state.productData.push(action.payload);
        })
        builder.addCase(createProduct.rejected,(state,action)=>{
            state.serverError = action.payload
            console.log(state.serverError)
        })

        builder.addCase(removeProduct.fulfilled,(state,action)=>{
            const index = state.productData.findIndex((ele)=>{
                return ele._id === action.payload._id
            })
            state.productData.splice(index,1);
        })
        builder.addCase(removeProduct.rejected,(state,action)=>{
            state.serverError = action.payload;
        })

        builder.addCase(updateProduct.fulfilled,(state,action)=>{
            const index = state.productData.findIndex((ele)=>{
                return ele._id === action.payload._id
            })
            state.productData[index] = action.payload
        })
        builder.addCase(updateProduct.rejected,(state,action)=>{
            state.serverError = action.payload;
        })

        builder.addCase(isApproved.fulfilled,(state,action)=>{
            const index = state.productData.findIndex((ele)=>{
                return ele._id === action.payload._id
            })
            state.productData[index] = action.payload;            
        })
        builder.addCase(isApproved.rejected, (state,action)=>{
            state.serverError = action.payload
        })

        builder.addCase(enquiryForm.fulfilled,(state,action)=>{
              const index = state.productData.findIndex((ele)=>{
               return ele._id === action.payload._id;
              })
              state.productData[index] = action.payload;
        })
        builder.addCase(enquiryForm.rejected, (state,action)=>{
            state.serverError = action.payload;
        })
    },
    reducers: {
        makeEditId : (state,action)=>{
            state.editId = action.payload;
            console.log("make edit id Action",state.editId)
        },
        
    }
})
 
export const {makeEditId} = productSlice.actions;
export default productSlice.reducer;