import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.token; // ✅ Correct: get the token string only

    if (!token) {
      return res.json({ success: false, message: "Not Authorized. Please log in again." });
    }

    // ✅ Verify the token using your secret key
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach the userId to the request body (for use in controllers)
    req.body.userId = token_decode.id;

    next(); // ✅ continue to the next middleware/controller
  } catch (error) {
    console.error("Auth error:", error);
    res.json({ success: false, message: "Authentication failed. Please log in again." });
  }
};

export default authMiddleware;
