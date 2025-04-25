
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const fetchUserAccount = createAsyncThunk('user/fetchUserAccount',async(_,{rejectWithValue})=>{
//here used first paramentr as empty object because asyncThunk fucntion takes 2 arugument - if we pass one argument - it will miss mathced
    try{
        console.log("fetchUserAccount executed")
        const response = await axios.get("/account",{headers:{Authorization:localStorage.getItem('token')}})
        console.log(response.data)
        return response.data

    }catch(err){
        console.log(err)
        return rejectWithValue({
            message: "something went wrong"
        })

    }

})

export const getUsers = createAsyncThunk('user/getUsers',async(_,{rejectWithValue})=>{
try{
    const response = await axios.get('/accounts',{headers:{Authorization:localStorage.getItem('token')}})
    console.log(response.data);
    return response.data;
}catch(error){
    return rejectWithValue({
        msg: error.message,
        error: error.response.data.Error
    })

}
})

export const updateActivate = createAsyncThunk('user/updateActivate',async(updateActivateobj,{rejectWithValue})=>{
    try{
        const response = await axios.put(`/accounts/${updateActivateobj._id}`,updateActivateobj,{headers:{Authorization:localStorage.getItem('token')}})
        console.log("updated value form com",updateActivateobj )
        console.log(response.data);
        return response.data;
    }catch(error){
        return rejectWithValue({
            msg: error.message,
            error: error.response.data.error
        })

    }
})

const userSlice = createSlice({
    name: 'user',
    initialState:{
        data: null,
        users:[],
        isLoggedIn: false,
        serverError: null
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchUserAccount.fulfilled,(state,action)=>{
            state.data = action.payload;
            state.isLoggedIn = true
        });
        builder.addCase(fetchUserAccount.rejected,(state,action)=>{
            state.serverError = action.payload 
        });

        builder.addCase(getUsers.fulfilled,(state,action)=>{
            state.users = action.payload;
        })
        builder.addCase(getUsers.rejected,(state,action)=>{
            state.serverError = action.payload;
        })

        builder.addCase(updateActivate.fulfilled,(state,action)=>{
            const index = state.users.findIndex((ele)=>{
                return ele._id === action.payload._id
            })
            state.users[index] = action.payload;
        })
    },
    reducers:{
        logIn :(state,action)=>{
            state.data = action.payload;
            state.isLoggedIn = true;
        },
        logOut :(state,action)=>{
            state.data = null;
            state.isLoggedIn = false;
        }
    }
})

export const {logIn, logOut} = userSlice.actions;
export default userSlice.reducer;