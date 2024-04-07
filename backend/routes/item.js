import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { addText, deleteItem, getItems, updateText } from "../controllers/item.js";

const router=express.Router();

router.post("/:link/text/new",verifyToken,addText);
router.get("/:link/:itemType",verifyToken,getItems);
router.patch("/:link/text/:itemId",verifyToken,updateText);
router.delete("/:link/:itemId",verifyToken,deleteItem);

export default router;