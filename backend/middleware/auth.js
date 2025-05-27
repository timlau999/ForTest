import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  console.log('Received token:', token);
  if (!token) {
    console.log('Token is missing'); 
    return res.json({ success: false, message: "Not Authorized Login Again" });
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', token_decode);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log('Token verification error:', error);
    res.json({success:false,message:"Error"});
  }
};
export default authMiddleware;
