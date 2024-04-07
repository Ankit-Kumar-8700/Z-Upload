import Item from "../models/item.js";

export const addText=async(req,res)=>{
    try {
        const { link }=req.params;
        
        const newItem=new Item({link:link, itemType:"text", data:" "})

        await newItem.save();

        const items=await Item.find({link:link, itemType:"text"})

        res.status(201).json(items);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const addFile=async(req,res)=>{
    try {
        const { link, itemType }=req.params;
        let {data}=req.body;

        
        if(typeof(data)!=="string" && typeof(data)!=="undefined") data=data[0];
        console.log(data);
        
        const newItem=new Item({link:link, itemType:itemType, data:data})

        await newItem.save();

        const items=await Item.find({link:link, itemType:itemType})

        res.status(201).json(items);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
}

export const getItems=async(req,res)=>{
    try {
        const {link, itemType}=req.params;
        const items=await Item.find({link:link, itemType:itemType})

        res.status(201).json(items);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}


export const updateText=async(req,res)=>{
    try {
        const {link,itemId}=req.params;
        const {data}=req.body;

        // console.log({link,itemId,data});

        const item=await Item.findById(itemId);
        if(!item) {
            return res.status(404).json({message:"Item not found"})
        }
        if(item.itemType!=="text"){
            return res.status(404).json({message:"Item isn't editable"})
        }
        item.data=data;
        await item.save();

        const items=await Item.find({link:link, itemType:"text"})

        res.status(201).json(items);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}


export const deleteItem=async(req,res)=>{
    try {
        const {link,itemId}=req.params;

        const item=await Item.findById(itemId);
        // console.log(item.data);
        await Item.findByIdAndDelete(item._id);

        const items=await Item.find({link:link, itemType:item.itemType})

        res.status(201).json(items);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}


