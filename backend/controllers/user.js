import User from "../models/user.js";


export const getUser=async(req,res)=>{
    try {
        const {id}=req.params;
        const user=await User.findById(id);
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const updateUser=async(req,res)=>{
    try {
        const {id}=req.params;
        const { name }=req.body;


        const user=await User.findByIdAndUpdate(id, { $set: { name: name }});

        await user.save();
        const newUser=await User.findById(id);
        res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        res.status(404).json({message: error.message})
    }
}