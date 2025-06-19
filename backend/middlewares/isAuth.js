const jwt= require('jsonwebtoken');
require("dotenv").config(); // Load environment variables from .env file
const isAuthenticated = async (req, res, next) => {
   //! Get token from headers
   const headerObj= req.headers;
   const token = headerObj.authorization && headerObj.authorization.split(" ")[1];
    
   //! Verify token
   const verifyToken = jwt.verify(token, process.env.JWT_SECRET,(err, decoded)=>{
    if(err){
        return false;
    }else{
        return decoded;
    }
   });

   if(verifyToken){
    //! Save user ID in request object
    req.user=verifyToken.id;
    next();
   }else{
     const error = new Error("Token is not valid or expired");
     next(error);
   }
};

module.exports = isAuthenticated;