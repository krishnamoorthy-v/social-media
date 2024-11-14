const { sign, verify } = require("jsonwebtoken");

require("dotenv").config();
const secret = process.env.SECRET;


function generateToken(user) {
   return sign( {_id: user._id }, secret, {expiresIn: "7d"});
}

function verifyToken(token) {
    return verify(token, secret);
}

const authorize = () => {
    return( (req, res, next) => {
        try {

            if(!req.headers["authorization"]) {
                throw new Error("Token expected");
            }
            const token = req.headers["authorization"].split(" ")[1];
            const token_info = verifyToken(token);

            if(token_info["_id"] == (req.params.id || req.params.userId)) {
                next();
            } else {
                throw new Error("Unauthorized access");
            }

        } catch(err) {
            res.status(400).send(err.message);
        }
    });
};

module.exports = {authorize, verifyToken, generateToken};