const jwt = require('jsonwebtoken')
const responseJson = require('../helpers/responseJson')

exports.verifyToken = (req, res, next) => {
    try {

        const token = req.headers.authorization.split(' ')[1]

        if (!token) return res.status(401).json({ message: 'Tidak Ada Token' })

        jwt.verify(token, 'defaultSecret', (err, decoded) => {
            if (err) {
                console.error('JWT verification failed:', err.message);
                return responseJson.error(res, "Invalid Token", 402);
            }
            req.user = decoded
            next()
        })

    } catch (error) {
        console.error(error)
        return responseJson.internalServerError(res)
    }
}