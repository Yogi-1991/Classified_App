
import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import categoryReducer from '../slices/categorySlice';
import productReducer from '../slices/productSlice';

const store = configureStore({
    reducer:{
        user : userReducer,
        category: categoryReducer,
        products: productReducer
    }
})

export default store;