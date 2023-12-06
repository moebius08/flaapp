const { verify } = require('jsonwebtoken');

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get("Authorization");
        if (token) {
            token = token.slice(7);
            verify(token, "secretkey", (err, decoded) => {
                if (err) {
                    return res.json({
                        success: 0,
                        message: "Invalid Token"
                    })
                } else {
                    req.user = decoded.result;
                    next();
                }
            })
        } else {
            res.json({
                success: 0,
                message: "Access Denied! Unauthorized User"
            })
        }
    }
}