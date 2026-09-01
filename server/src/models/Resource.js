import mongoose from "mongoose";
const schema=new mongoose.Schema({
 title:String,fileName:String,filePath:String,
 uploadedBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
},{timestamps:true});
export default mongoose.model("Resource",schema);
