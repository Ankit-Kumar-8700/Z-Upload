import Link from "../models/link.js";
import User from "../models/user.js";
import Item from "../models/item.js";
import bcrypt from "bcrypt";


export const ownLink=async(req,res)=>{
    try {
        const {link}=req.params;
        const { id }=req.user;
        console.log(req.user);
        const user=await User.findById(id);

        const newLink=new Link({userId:id, privacy:"private", link:link, password:"", editable:false})

        const saveLink=await newLink.save();
        user.links.push(link);

        await user.save();

        delete user.password;
        delete saveLink.password;

        res.status(201).json({user:user,linkData:saveLink});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
}

export const getLinkData=async(req,res)=>{
    try {
        const {link,password}=req.params;
        const { id}=req.user;
        const linkData=await Link.findOne({link:link});
        if(!linkData){
            return res.status(200).json({message:"Unregistered Link"})
        }
        if(linkData.userId!==id && linkData.privacy==="private"){
            return res.status(400).json({message:"Private link"})
        }
        if(linkData.userId!==id && linkData.privacy==="protected" && password==="null"){
            return res.status(200).json({message:"Password Required"})
        }
        if(linkData.userId!==id && linkData.privacy=="protected"){
            const isMatched=await bcrypt.compare(password,linkData.password);
            if(!isMatched) return res.status(400).json({message:"Wrong Password"})
        }
        delete linkData.password;
        res.status(200).json({message:"Data sent",linkData:linkData})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}


export const updateLinkData=async(req,res)=>{
    try {
        const {link}=req.params;
        const {id}=req.user;
        const { privacy, password, editable }=req.body;
        console.log(privacy,password,editable);

        const linkData=await Link.findOne({link:link});

        if(!linkData){
            return res.status(200).json({message:"Unregistered Link"})
        }

        if(!linkData.userId===id){
            return res.status(404).json({message:"You are not the owner of this link"})
        }
        if(privacy==="protected" && password.length>7){
            const salt=await bcrypt.genSalt();
            const passwordHash=await bcrypt.hash(password,salt);
            linkData.password=passwordHash;
        }
        linkData.privacy=privacy;
        linkData.editable=editable;

        await linkData.save();

        delete linkData.password;

        res.status(200).json(linkData)
    } catch (error) {
        console.log(error.message);
        res.status(404).json({message: error})
    }
}


export const deleteLink=async(req,res)=>{
    try {
        const {link}=req.params;
        const {id}=req.user;

        const linkData=await Link.findOne({link:link});

        if(!linkData){
            return res.status(200).json({message:"Unregistered Link"})
        }

        if(linkData.userId!==id){
            return res.status(404).json({message:"You are not the owner of this link"})
        }

        await Link.findByIdAndDelete(linkData.id);

        const user=await User.findById(id);

        user.links=user.links.filter((temp)=>temp!==link);

        await User.findByIdAndUpdate(id,
            {links:user.links}
        )

        // const items=await Item.find({link});

        // for(let i=0;i<items.length;i++){
        //     await Item.findByIdAndDelete(items[i].id);
        // }

        await Item.deleteMany({link:link})

        res.status(200).json({user:user})
    } catch (error) {
        console.log(error.message);
        res.status(404).json({message: error.message})
    }
}


