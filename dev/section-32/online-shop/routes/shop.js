const express = require('express');
const shopController = require('../controllers/shop-controller')


const router = express.Router();

router.get('/products', shopController.getProducts);

module.exports = router;
