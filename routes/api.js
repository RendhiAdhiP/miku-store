const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')
const ProdukController = require('../controllers/ProdukController')
const OrderController = require('../controllers/OrderController')
const ReportController = require('../controllers/ReportController')
const { verifyToken } = require('../middleware/verifyToken')
const { isAdmin } = require('../middleware/isAdmin')

router.get('/', (req, res) => {
    return res.send('test')
})

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)

router.get('/produk', ProdukController.getAll)
router.post('/produk', [verifyToken, isAdmin], ProdukController.create)
router.put('/produk/:id', [verifyToken, isAdmin], ProdukController.update)
router.delete('/produk/:id', [verifyToken, isAdmin], ProdukController.delete)

router.get('/order', OrderController.getAll)
router.post('/order', verifyToken, OrderController.create)

router.get('/report', [verifyToken, isAdmin], ReportController.report)

module.exports = router