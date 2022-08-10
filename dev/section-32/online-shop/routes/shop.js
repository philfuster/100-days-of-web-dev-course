const express = require('express');
const shopController = require('../controllers/shop-controller');
const makeSafe = require('../util/make-safe');


const router = express.Router();

router.get('/products', shopController.getProducts);

router.get('/products/:id', makeSafe(shopController.getSingleProduct));

module.exports = router;
