import mongoose from "mongoose";

const configDb = async()=>{
try{
    mongoose.connect(process.env.DB_PATH);
    console.log('Connected to the Database');
}catch(error){
 console.log(error);
}
}

export default configDb;