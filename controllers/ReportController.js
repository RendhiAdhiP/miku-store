
const { Order, Produk, } = require('../models')
const responseJson = require('../helpers/responseJson')
const { fn, col } = require('sequelize')
exports.report = async (req, res) => {
    try {
        const jumlahTransaksi = await Order.count()
        const pendapatan = await Order.sum('total_bayar')
        const totalProduk = await Produk.count()
        const totalPelanggan = await Order.count({
            distinct: true,
            col: "id"
        })
        const populerProduk = await Order.findAll({
            attribuets: [[
                fn('DISTICNT', col('produkId'))
            ]],
            order: [
                ['produkId', 'DESC']
            ]
        })

        const formated = {
            jumlahTransaksi: jumlahTransaksi,
            pendapatan: pendapatan,
            totalProduk: totalProduk,
            totalPelanggan: totalPelanggan,
            populerProduk: populerProduk,
        }

        return responseJson.successWithData(res, "Success", formated, 200)
    } catch (error) {
        console.error(error)
        return responseJson.internalServerError(res)
    }
}