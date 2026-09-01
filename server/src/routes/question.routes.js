import {Router} from "express";
import Question from "../models/Question.js";
import {auth} from "../middleware/auth.js";
const r=Router();
const map={dsa:["dsa"],communication:["vocabulary","email","puzzle"],aptitude:["aptitude","reasoning"]};

r.get("/daily",auth,async(req,res)=>{
 const type=req.query.type||"dsa";
 const qs=await Question.find({active:true,category:{$in:map[type]||["dsa"]}})
  .select("-answer -explanation").sort({createdAt:-1}).limit(12);
 res.json(qs);
});
export default r;
