import Category from "../modules/category-schema-module.js";
import { validationResult} from 'express-validator';
import Product from "../modules/product-schema-module.js";
const categoryControl = {};

categoryControl.register = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({Error: error.array()});
    }

    const body = req.body;
    try{
        const checkCategory = await Category.findOne({name:body.name});
        if(checkCategory){
            return res.status(400).json({Error:'Category already exists'})
        }else{        
        const category = await Category.create(body);
        return res.status(201).json(category);
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({Error:'Something went wrong'});
    }
}

categoryControl.listCategory = async(req,res)=>{
    try{
        const category = await Category.find();
        res.json(category);
    }catch(error){
        console.log(error);
        return res.status(500).json({Error:'Something went wrong'});
    }
}

categoryControl.categoryUpdate =async(req,res)=>{
    const error = validationResult(req);
   if(!error.isEmpty()){
        return res.status(400).json({Error:error.array()});
    }
    const categoryId = req.params.id;
    const {name} = req.body;
    try{
    const category = await Category.findByIdAndUpdate(categoryId,{name:name},{new:true});
    if(!category){
        return res.status(404).json({Error: "category not found for provided Id"});
       }
       res.json(category);
    }catch(error){
        console.log(error);
        return res.status(500).json({Error: 'Something went wrong'});
    }   

}

categoryControl.categoryDelete = async(req,res)=>{
    const error = validationResult(req);    
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()});
    }
    const id = req.params.id;
    try{

        const product = await Product.findOne({category:id});
        if(product){
            return res.status(400).json({error:"There is product record found for this catgory ID"})        
        }

        const category = await Category.findOneAndDelete({_id:id}); 
        if(!category){
            return res.status(404).json({error:"Category not found"})
        }        
        res.json(category);
    }catch(error){
        console.log(error);
        return res.status(500).json({error: 'Something went wrong'});
    }

}

export default categoryControl;