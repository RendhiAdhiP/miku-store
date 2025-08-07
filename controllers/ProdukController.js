
const responseJson = require('../helpers/responseJson')
const Joi = require('joi')
const { Produk } = require('../models')

const multer = require('multer')
const fs = require('fs')
const path = require('path')
let filename = null;

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        const dir = 'public/produk'
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }

        cb(null, dir)
    },
    filename: (req, file, cb) => {
        filename = Date.now() + '-' + file.originalname
        cb(null, filename)
    }
})

const upload = multer({
    storage,
    limits: { fileSize: 1 * 1024 * 1024 },
    // fileFilter: (req, file, cb) => {
    //     const allowedType = ['image/jpg', 'image/png']
    //     if (!allowedType.includes(file.mimetype)) {
    //         return cb(new Error("Hanya boleh file png dan jpg"))
    //     }
    //     cb(null, true)
    // }
}).single('foto')

const deleteFoto = (filename) => {
    const filePath = path.join(__dirname, '../public/produk', filename)
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log("gagal menghapus foto")
        }
        console.log('foto berhasil dihapus')
    })
}

exports.getAll = async (req, res) => {
    try {
        const produks = await Produk.findAll()

        return responseJson.successWithData(res, "Data ditemukan", produks, 200)

    } catch (error) {
        console.log(error)
        return responseJson.internalServerError(res)
    }
}

exports.create = async (req, res) => {
    upload(req, res, async (err) => {
        try {

            if (err) {
                console.log(err)
                return responseJson.error(res, "Upload foto gagal", 400)
            }

            const schemaCreateUser = Joi.object({
                nama_produk: Joi.string().required(),
                harga: Joi.number().required(),
            })

            const { error, value } = schemaCreateUser.validate(req.body, {
                abortEarly: false,
                allowUnknown: false,
            })

            if (error) {
                console.log(error)
                return responseJson.errorValidation(res, 'Data tidak sesuai', error.details.map(e => e.message))
            }

            const newProduk = await Produk.create({
                nama_produk: value.nama_produk,
                harga: value.harga,
                foto: req?.file?.fieldname ? filename : null
            })

            const response = {
                nama_produk: newProduk.nama_produk,
                harga: newProduk.harga,
                foto: `produk/${newProduk.foto}`
            }

            return responseJson.successWithData(res, "Berhasil Menambahkan Produk", response, 201)

        } catch (error) {
            console.log(error)
            return responseJson.internalServerError(res)
        }
    })
}

exports.update = async (req, res) => {
    upload(req, res, async (err) => {
        try {

            if (err) {
                return responseJson.error(res, "Upload foto gagal", 400)
            }

            const schemaUpdateUser = Joi.object({
                nama_produk: Joi.string().optional(),
                harga: Joi.number().optional(),
            })

            const { error, value } = schemaUpdateUser.validate(req.body, {
                abortEarly: false,
                allowUnknown: false,
            })

            if (error) {
                console.log(error)
                return responseJson.errorValidation(res, 'Data tidak sesaui', error.details.map(e => e.message))
            }

            const oldProduk = await Produk.findOne({
                where: {
                    id: req.params.id
                }
            })


            if (!oldProduk) {
                return responseJson.error(res, "Produk tidak ditemukan", 404)
            }

            deleteFoto(oldProduk.foto)

            await oldProduk.update({
                nama_produk: value.nama_produk,
                harga: value.harga,
                foto: req?.file?.fieldname ? filename : null
            })

            const response = {
                nama_produk: oldProduk.nama_produk,
                harga: oldProduk.harga,
                foto: `produk/${oldProduk.foto}`
            }

            return responseJson.successWithData(res, "Berhasil Mengupdate Produk", response, 201)

        } catch (error) {
            console.log(error)
            return responseJson.internalServerError(res)
        }
    })
}


exports.delete = async (req, res) => {
    try {

        const produk = await Produk.findOne({
            where: {
                id: req.params.id
            }
        })

        if (!produk) {
            return responseJson.error(res, "Produk tidak ditemukan", 404)
        }

        deleteFoto(produk.foto)

        produk.destroy()

        return responseJson.success(res, "Berhasil Menghapus Produk")


    } catch (error) {
        console.log(error)
        return responseJson.internalServerError(res)
    }
}