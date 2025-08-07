
exports.errorValidation = (res, message = 'Data tidak sesuai', error = [], code = 422) => {
    return res.status(code).json({
        message: message,
        error: error,
    })
}

exports.error = (res, message = 'Error', code = 400) => {
    return res.status(code).json({
        message: message,
    })
}

exports.successWithData = (res, message = 'Success', data = [], code = 200) => {
    return res.status(code).json({
        message: message,
        data: data,
    })
}

exports.success = (res, message = 'Success', code = 200) => {
    return res.status(code).json({
        message: message,
    })
}

exports.internalServerError = (res) => {
    return res.status(500).json({
        message: "Server Sedang Bermasalah",
    })
}