import './App.css';
import {Routes, Route, Link, useNavigate} from 'react-router-dom'
import Login from './components/Login';
import Register from './components/Register';
import Account from './components/Account';
import { useSelector, useDispatch } from 'react-redux';
import { logIn, logOut, fetchUserAccount } from './slices/userSlice';
import { useEffect } from 'react';
//import axios from './config/axios';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import AddCategory from './components/AddCategory';
import AddProduct from './components/AddProduct';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProducts from './components/AdminProducts';
import ProductDetails from './components/ProductDetails';
import UserAccounts from './components/UserAccounts';
import AccountDetails from './components/AccountDetails';
import Enquiries from './components/Enquiries';
import BuyerProducts from './components/BuyerProducts';


function App() {

  const {isLoggedIn, data} = useSelector((state)=>{
    return state.user;
  })
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(()=>{
    if(localStorage.getItem("token")){//manage reload page in the component level using axios here
       dispatch(fetchUserAccount());
      // async function fetchUserAccount() {
      //   try{
      //     const response = await axios.get('/account',{headers:{Authorization: localStorage.getItem("token")}})
      //     console.log(response.data)
      //     dispatch(logIn(response.data))
      //   }catch(err){

      //     console.log(err)
      //   }
      // }
      // fetchUserAccount();
    }
  },[])



  return (
    <div className="App">
     <h2 style={{ color: "purple", fontWeight: "bold" }}>Classified App</h2>
     {isLoggedIn ? <div className="navbar">
            {/* <Link to="/dashboard">Dashboard</Link>| */}
            <Link to="/account" className="nav-link">My Profile</Link>
            {data.role === "admin" && <Link to="/addcategory" className="nav-link">Category</Link> }            
            {data.role === "admin" && <Link to="/admin-products" className="nav-link">Products</Link>}
            {data.role === "admin" && <Link to="/user-accounts" className="nav-link">Accounts</Link>}
            {data.role === "seller" && <Link to="/addproduct" className="nav-link">Products</Link> }
            {data.role === "seller" && <Link to="/enquiries" className="nav-link">Enquiries</Link> }
            {data.role === "buyer" && <Link to="/buyer-products" className="nav-link">products</Link> }

            {" "}
            <button className="logout-btn" onClick={()=>{
              dispatch(logOut())
              localStorage.removeItem("token");
              navigate("/login")
            }}>Logout</button>
     </div>      
     : <>
     <Link to="/login" className="nav-link">Login</Link>|<Link to="/register" className="nav-link">Register</Link>
     </>}
     

    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/account"element={
        <PrivateRoute>
          <Account/>
        </PrivateRoute>
        }/>
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard/>
          </PrivateRoute>
        }/>
      <Route path="/addcategory" element={
        <PrivateRoute>
          <ProtectedRoute roles={["admin"]}>
              <AddCategory/>
          </ProtectedRoute>
        </PrivateRoute>
        }/>
      
      <Route path="/unauthorized" element={<h2>No access to the page you are looking for...</h2>}/>

      <Route path="/admin-products" element={<PrivateRoute>
        <ProtectedRoute roles={['admin']}>
         <AdminProducts/>
        </ProtectedRoute>
        </PrivateRoute>}/>
      <Route path='/product-details/:id' element={<PrivateRoute>
        <ProtectedRoute roles={['admin']}>
        <ProductDetails/>
        </ProtectedRoute>
        </PrivateRoute>}/>

       <Route path="/user-accounts" element={<PrivateRoute>
          <ProtectedRoute roles={['admin']}>
            <UserAccounts/>
            </ProtectedRoute>
          </PrivateRoute>}/> 

          <Route path='/user-account/:id' element={<PrivateRoute>
        <ProtectedRoute roles={['admin']}>
        <AccountDetails/>
        </ProtectedRoute>
        </PrivateRoute>}/>    

        <Route path="/addproduct" element={
        <PrivateRoute>
          <ProtectedRoute roles={["seller"]}>
            <AddProduct/>
          </ProtectedRoute>
        </PrivateRoute>
        }/>

        <Route path="/enquiries" element={
        <PrivateRoute>
          <ProtectedRoute roles={["seller"]}>
            <Enquiries/>
          </ProtectedRoute>
        </PrivateRoute>
        }/>   
        <Route path="/buyer-products" element={
        <PrivateRoute>
          <ProtectedRoute roles={["buyer"]}>
            <BuyerProducts/>
          </ProtectedRoute>
        </PrivateRoute>
        }/>                               
      </Routes>


    </div>
  );
}

export default App;
