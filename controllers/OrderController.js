const responseJson = require('../helpers/responseJson')
const Joi = require('joi')
const { Order } = require('../models')
const { Produk } = require('../models')
const { User } = require('../models')

exports.getAll = async (req, res) => {
    try {
        const order = await Order.findAll({
            include: [
                { model: User },
                { model: Produk, },
            ]
        })

        const formated = order.map((order) => ({
            id: order.id,
            nama_pelanggan: order.User.username,
            nama_produk: order.Produk.nama_produk,
            jumlah: order.jumlah,
            total_bayar: order.total_bayar,
            createdAt: order.createdAt,
        }))


        return responseJson.successWithData(res, "Data ditemukan", formated, 200)
    } catch (error) {
        console.log(error)
        return responseJson.internalServerError(res)
    }
}

exports.create = async (req, res) => {
    try {
        const schemaCreateOrder = Joi.object({
            userId: Joi.number().required(),
            produkId: Joi.number().required(),
            jumlah: Joi.number().required()
        })

        const { error, value } = schemaCreateOrder.validate(req.body, {
            abortEarly: false,
            allowUnknown: false,
        })

        if (error) {
            console.log(error)
            return responseJson.errorValidation(res, 'Data tidak sesuai', error.details.map(e => e.message))
        }

        const produk = await Produk.findOne({
            where: {
                id: req.body.produkId
            }
        })

        if (!produk) {
            return responseJson.error(res, 'Produk tidak ada')
        }

        const newOrder = await Order.create({
            userId: value.userId,
            produkId: value.produkId,
            jumlah: value.jumlah,
            total_bayar: produk.harga * value.jumlah,
        })

        return responseJson.successWithData(res, "Berhasil Order", newOrder, 201)
    } catch (error) {
        console.log(error)
        return responseJson.internalServerError(res)
    }
}