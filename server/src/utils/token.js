import jwt from "jsonwebtoken";
export const signUser=u=>jwt.sign({id:u._id.toString(),email:u.email,role:u.role},process.env.JWT_SECRET,{expiresIn:"2h"});
