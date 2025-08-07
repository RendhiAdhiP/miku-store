const { where } = require("sequelize")
const { User } = require("../models")
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { config } = require("dotenv")

exports.register = async (req, res) => {
    try {
        console.log(req.body)
        const { username, password } = req.body

        if (!username) {
            return res.status(422).json({
                message: 'username tidak boleh kosong'
            })
        }

        if (!password) {
            return res.status(422).json({
                message: 'password tidak boleh kosong'
            })
        }

        const exist = User.findOne({
            where: {
                username: username
            }
        })

        if (exist) {
            return res.status(400).json({
                message: 'Username sudah ada'
            })
        }

        await User.create({
            username: username,
            password: bcryptjs.hashSync(password),
        })

        return res.status(201).json({
            message: 'Sign Up Berhasil'
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

exports.login = async (req, res) => {
    try {

        const { username, password } = req.body

        if (!username) {
            return res.status(422).json({
                message: 'username tidak boleh kosong'
            })
        }

        if (!password) {
            return res.status(422).json({
                message: 'password tidak boleh kosong'
            })
        }

        const exsist = await User.findOne({
            where: {
                username: username
            }
        })

        const passwordValid = bcryptjs.compareSync(password, exsist.password)

        if (!passwordValid) {
            return res.status(400).json({
                message: 'username atau password salah'
            })
        }

        const token = `Bearer ` + jwt.sign({
            id: exsist.id,
            username: exsist.username,
            role: exsist.role
        }, 'defaultSecret', {
            expiresIn: 7200
        })

        return res.status(200).json({
            message: "Login Success",
            token: token
        })


    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}