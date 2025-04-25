import jwt from 'jsonwebtoken';
const authenticate = async(req,res,next)=>{
    const token = req.headers['authorization'];
    if(!token){
        return res.status(404).json({Error:'Please enter the Token'});
    }
    try{
        const tokenExtract = token.split(' ')[1];//used split methoed convert string into array element and there we added the word "beares" while creteing the token so [1] getting second element form array
        const tokenData = await jwt.verify(tokenExtract,process.env.SECRET_KEY);
       // console.log(tokenData);
        req.userId=tokenData.userId;     
        req.role=tokenData.role;
        next();
    }catch(error){
        return res.status(500).json(error);
    }
}

export default authenticate;