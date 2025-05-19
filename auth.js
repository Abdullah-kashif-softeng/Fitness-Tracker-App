const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ msg: "Authentication Required" });
        }
        const decoded = jwt.verify(token, "%%^&^&*@@!!");
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        return res.status(403).json({ msg: "Invalid or Expired Token" });
    }
};

module.exports = auth;
