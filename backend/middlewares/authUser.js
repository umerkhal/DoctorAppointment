

import jwt from "jsonwebtoken";


//admin auth middleware
const authUser = async (req, res, next) => {
  try {

    const {token} = req.headers;
    if (!token) {
      return res.json({success:false, message:"Admin not login"});
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    // req.body.userId = token_decode.id;
        // Best practice: attach user ID to req.user, not req.body
    req.user = { id: token_decode.id };
    next();
    
  } catch (error) {
    console.log(error);
    res.json({success:false, message:"Admin not login in authAdmin middleware"});
  }
};
export default authUser;
