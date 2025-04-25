import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { checkSchema } from 'express-validator';
import configDb from './configDB/db.js';
import {userRegisterValidation,userLoginValidation} from './app/validations/user-register-login-validator.js';
import IdValidation from './app/validations/id-validator.js';
import categoryValidation from './app/validations/category-validator.js';
import userControl from './app/controller/user-controller.js';
import categoryControl from './app/controller/category-controller.js';
import authenticate from './app/middlewares/authenticate.js';
import authorization from './app/middlewares/authorization.js';
import productValidation from './app/validations/product-validator.js';
import productControl from './app/controller/product-controller.js';
import { upload } from './app/middlewares/upload-middleware.js'

const app = express();
dotenv.config();
const port = process.env.PORT;
configDb();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


//admin
app.post('/register',checkSchema(userRegisterValidation),userControl.register);
app.post('/login',checkSchema(userLoginValidation),userControl.login);
app.get('/accounts',authenticate,authorization(['admin']),userControl.listAccount);
app.get('/account',authenticate,authorization(['admin','seller','buyer']),userControl.account)//Try to get single account that logged in
app.put('/accounts/:id',checkSchema(IdValidation),authenticate,authorization(['admin','seller','buyer']),userControl.deactivateAccount);

//user
app.put('/user/profile',authenticate,authorization(['seller','buyer']),userControl.userManage)

//Category
app.post('/category',checkSchema(categoryValidation),authenticate,authorization(['admin']),categoryControl.register);
app.get('/category',categoryControl.listCategory);
app.put('/category/:id',authenticate,checkSchema(IdValidation),authorization(['admin']),categoryControl.categoryUpdate);
app.delete('/category/:id',authenticate, checkSchema(IdValidation),authorization(['admin']), categoryControl.categoryDelete);

//Product
app.post('/product',upload.single('image'),checkSchema(productValidation),authenticate,authorization(['seller']),productControl.create);
app.get('/products',authenticate,authorization(['admin','seller','buyer']),productControl.listProduct);
app.put('/product/:id',upload.single('image'),checkSchema(IdValidation),authenticate, authorization(['admin','seller']), productControl.productUpdate);
app.delete('/product/:id',authenticate, checkSchema(IdValidation),authorization(['admin','seller']), productControl.productDelete);
app.put('/approveProduct/:id',authenticate,authorization(['admin']),productControl.productApprove);

//buyer

app.put('/enquries/:id',authenticate,authorization(['buyer','seller']),checkSchema(IdValidation),productControl.enquries);
//app.get('enquires',authenticate,authorization(['admin']),productControl.enquriesList)

app.listen(port,()=>{
    console.log('Server is running on the port number: '+port);
});
