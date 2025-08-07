const responseJson = require('../helpers/responseJson')

exports.isAdmin = (req, res, next) => {
    try {

        console.log(req.user.role)
        if (req.user.role != 'admin') {
            return responseJson.error(res, "Anda tidak memiliki askses", 403)
        }
        

        next()

    } catch (error) {
        console.log(error)
        return responseJson.internalServerError(res)
    }
}