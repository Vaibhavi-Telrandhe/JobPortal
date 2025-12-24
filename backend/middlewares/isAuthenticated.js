import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    // ✅ Check Authorization header first, then fallback to cookie
    let token = req.headers.authorization?.replace("Bearer ", "");
    
    if (!token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    req.id = decoded.userId;
    next();
  } catch (error) {
    console.log("Auth error:", error.message);
    return res.status(401).json({
      message: "Authentication failed",
      success: false,
      error: error.message,
    });
  }
};

export default isAuthenticated;