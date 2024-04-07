import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { deleteLink, getLinkData, ownLink, updateLinkData } from "../controllers/link.js";

const router=express.Router();

router.post("/:link",verifyToken,ownLink);
router.get("/:link/pass/:password",verifyToken,getLinkData);
router.patch("/:link",verifyToken,updateLinkData);
router.delete("/:link",verifyToken,deleteLink);

export default router;