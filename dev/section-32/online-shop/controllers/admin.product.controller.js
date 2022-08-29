const Product = require("../models/product.model");
const sessionFlash = require("../util/session-flash");
const productValidation = require("../util/product.validation");

async function getProducts(req, res) {
	const products = await Product.fetchAll();
	return res.render("admin/products/all-products", { products });
}

async function getUpdateProduct(req, res) {
	const { id: productId } = req.params;
	const existingProduct = await Product.findById(productId);
	const sessionErrorData = sessionFlash.getSessionData(req, {
		title: "",
		imageUrl: "",
		summary: "",
		price: 0,
		description: "",
	});
	const inputData = {
		hasError: sessionErrorData.hasError,
		message: sessionErrorData.message,
		title: sessionErrorData.title || existingProduct.title,
		imageUrl: sessionErrorData.imageUrl || existingProduct.imageUrl,
		summary: sessionErrorData.summary || existingProduct.summary,
		description: sessionErrorData.description || existingProduct.description,
		price: sessionErrorData.price || existingProduct.price,
		id: productId,
	};

	return res.render("admin/products/update-product", {
		inputData,
	});
}

async function createProduct(req, res) {
	const { file: uploadedImageFile } = req;
	const product = new Product({
		...req.body,
		image: uploadedImageFile.filename,
	});
	const productIsValid = productValidation.productIsValid(product);
	if (!productIsValid) {
		sessionFlash.flashDataToSession(
			req,
			{
				hasError: true,
				message: `Invalid Product.`,
				title: product.title,
				summary: product.summary,
				description: product.description,
				price: product.price,
			},
			function () {
				res.redirect(`/admin/products/new`);
			}
		);
		return;
	}
	const existingProduct = await product.getProductWithSameTitle();
	if (existingProduct.id != null) {
		sessionFlash.flashDataToSession(
			req,
			{
				hasError: true,
				message: `Invalid Product. Product Title already exists.`,
				title: product.title,
				summary: product.summary,
				description: product.description,
				price: product.price,
			},
			function () {
				res.redirect(`/admin/products/new`);
			}
		);
		return;
	}

	await product.save();

	return res.redirect(`/admin/products`);
}

async function updateProduct(req, res) {
	const { id: productId } = req.params;
	const { file: uploadedImageFile } = req;
	const product = new Product({
		...req.body,
		_id: productId,
	});
	if (uploadedImageFile) {
		product.replaceImage(uploadedImageFile.filename);
	}
	const existingProduct = await Product.findById(productId);
	if (product.title !== existingProduct.title) {
		// product title change. Make sure no other product exists
		// with that title already..
		const productExistsWithEnteredTitle = await product.existsAlready();
		if (productExistsWithEnteredTitle) {
			sessionFlash.flashDataToSession(
				req,
				{
					hasError: true,
					message: `Invalid product title, "${product.title}" entered. Another product exists with it already.`,
					title: existingProduct.title,
					summary: product.summary,
					description: product.description,
					price: product.price,
					imageUrl: existingProduct.imageUrl,
				},
				function () {
					res.redirect(`/admin/products/${productId}`);
				}
			);
			return;
		}
	}
	const productIsValid = productValidation.productIsValid(product);
	if (!productIsValid) {
		sessionFlash.flashDataToSession(
			req,
			{
				hasError: true,
				message: `Invalid Product.`,
				title: product.title,
				summary: product.summary,
				description: product.description,
				imageUrl: existingProduct.imageUrl,
				price: product.price,
			},
			function () {
				res.redirect(`/admin/products/${productId}`);
			}
		);
		return;
	}
	if (!existingProduct.equals(product)) {
		await product.save();
	}

	return res.redirect(`/admin/products`);
}

function getNewProductForm(req, res) {
	const sessionErrorData = sessionFlash.getSessionData(req, {
		title: "",
		summary: "",
		price: 0,
		description: "",
	});
	return res.render("admin/products/new-product", {
		inputData: sessionErrorData,
	});
}

async function deleteProduct(req, res) {
	const { id: productId } = req.params;
	// to consider: delete requirements: should not be on an open order.
	const product = await Product.findById(productId);
	await product.remove();
	res.json({ message: "Deleted Product" });
}

module.exports = {
	getUpdateProduct: getUpdateProduct,
	getProducts,
	createProduct,
	getNewProductForm,
	updateProduct,
	deleteProduct,
};
