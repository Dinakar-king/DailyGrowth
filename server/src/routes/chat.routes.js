import {Router} from "express";
import {auth} from "../middleware/auth.js";
import {aiChat} from "../services/ai.service.js";
const r=Router();
r.post("/",auth,async(req,res)=>{
 try{res.json({answer:await aiChat(String(req.body.message||""))})}
 catch(e){res.status(500).json({message:e.message})}
});
export default r;
