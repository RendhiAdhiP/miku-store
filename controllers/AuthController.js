const { where } = require("sequelize")
const { User } = require("../models")
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { config } = require("dotenv")
const responseJson = require('../helpers/responseJson')

exports.register = async (req, res) => {
    try {
        console.log(req.body)
        const { username, password } = req.body

        if (!username) {
            return responseJson.error(res, "Username tidak boleh kosong", 422)
        }

        if (!password) {
            return responseJson.error(res, "Password tidak boleh kosong", 422)
        }

        const exist = User.findOne({
            where: {
                username: username
            }
        })

        if (exist) {
            return responseJson.error(res, "Username sudah dipakai", 400)
        }

        await User.create({
            username: username,
            password: bcryptjs.hashSync(password),
        })

        return responseJson.success(res, "Register berhasil", 201)

    } catch (error) {
        console.error(error)
        return responseJson.internalServerError(res)
    }
}

exports.login = async (req, res) => {
    try {

        const { username, password } = req.body

        if (!username) {
            return responseJson.error(res, "Username tidak boleh kosong", 422)
        }

        if (!password) {
            return responseJson.error(res, "Password tidak boleh kosong", 422)
        }

        const exsist = await User.findOne({
            where: {
                username: username
            }
        })

        const passwordValid = bcryptjs.compareSync(password, exsist.password)

        if (!passwordValid) {
            return responseJson.error(res, "Username atau password salah", 400)

        }

        const token = `Bearer ` + jwt.sign({
            id: exsist.id,
            username: exsist.username,
            role: exsist.role
        }, 'defaultSecret', {
            expiresIn: 7200
        })

        return responseJson.successWithData(res, "Login berhasil", [{
            message: "Login Success",
            token: token
        }], 200)


    } catch (error) {
        console.error(error)
        return responseJson.internalServerError(res)
    }
}