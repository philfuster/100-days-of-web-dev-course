const path = require("path");
const Product = require("../models/product");
const validationSession = require("../util/validation.session");
const productValidation = require("../util/product.validation");
const fsPromises = require("fs").promises;

async function getProducts(req, res) {
	const products = await Product.fetchAll();
	return res.render("admin/products/products", { products });
}

async function getSingleProduct(req, res) {
	const { id: productId } = req.params;
	const existingProduct = new Product(null, null, null, null, null, productId);
	await existingProduct.fetch();
	if (existingProduct.name == null || existingProduct.price == null) {
		throw "Invalid Product";
	}
	const sessionErrorData = validationSession.getSessionErrorData(req, {
		name: "",
		imagePath: "",
		summary: "",
		price: 0,
		description: "",
	});
	const inputData = {
		hasError: sessionErrorData.hasError,
		message: sessionErrorData.message,
		name: sessionErrorData.name || existingProduct.name,
		imagePath: sessionErrorData.imagePath || existingProduct.imagePath,
		summary: sessionErrorData.summary || existingProduct.summary,
		description: sessionErrorData.description || existingProduct.description,
		price: sessionErrorData.price || existingProduct.price,
		productId,
	};

	return res.render("admin/products/product-form", {
		product: existingProduct,
		inputData,
	});
}

async function createProduct(req, res) {
	const { file: uploadedImageFile } = req;
	const {
		title: enteredName,
		summary: enteredSummary,
		price: enteredPrice,
		description: enteredDescription,
	} = req.body;
	const product = new Product(
		enteredName,
		enteredSummary,
		enteredPrice,
		`/${uploadedImageFile.path.replace(/\\/g, "/")}`,
		enteredDescription,
		null
	);
	const productIsValid = productValidation.productIsValid(product);
	if (!productIsValid) {
		validationSession.flashErrorsToSession(
			req,
			{
				hasError: true,
				message: `Invalid Product.`,
				name: enteredName,
				summary: enteredSummary,
				description: enteredDescription,
				imagePath: uploadedImageFile.path,
				price: enteredPrice,
			},
			function () {
				res.redirect(`/admin/products`);
			}
		);
		return;
	}
	const existingProduct = product.getProductWithSameName();
	if (existingProduct.id != null) {
		validationSession.flashErrorsToSession(
			req,
			{
				hasError: true,
				message: `Invalid Product. Product Title already exists.`,
				name: enteredName,
				summary: enteredSummary,
				description: enteredDescription,
				price: enteredPrice,
				description: enteredDescription,
			},
			function () {
				res.redirect(`/admin/products/`);
			}
		);
		return;
	}

	await product.create();

	return res.redirect(`/admin/products`);
}

async function saveProduct(req, res) {
	const { id: productId } = req.params;
	const { file: uploadedImageFile } = req;
	const {
		title: enteredName,
		summary: enteredSummary,
		price: enteredPrice,
		description: enteredDescription,
	} = req.body;
	const enteredProduct = new Product(
		enteredName,
		enteredSummary,
		enteredPrice,
		// imagePath logic below.
		null,
		enteredDescription,
		productId
	);
	const existingProduct = new Product(null, null, null, null, null, productId);
	await existingProduct.fetch();
	if (existingProduct.name == null || existingProduct.price == null) {
		throw "Invalid product..";
	}
	if (enteredProduct.name !== existingProduct.name) {
		// product name change. Make sure no other product exists
		// with that name already..
		const productExistsWithEnteredName = await enteredProduct.existsAlready();
		if (productExistsWithEnteredName) {
			validationSession.flashErrorsToSession(
				req,
				{
					hasError: true,
					message: `Invalid product name, "${enteredProduct.name}" entered. Another product exists with it already.`,
					name: existingProduct.name,
					summary: enteredSummary,
					description: enteredDescription,
					price: enteredPrice,
					// restore on-file image path. Resetting the flow, allowing user to change to a new pic if they want.
					imagePath: existingProduct.imagePath,
				},
				function () {
					res.redirect(`/admin/products/${productId}`);
				}
			);
			return;
		}
	}
	if (uploadedImageFile && uploadedImageFile.path.length > 0) {
		enteredProduct.imagePath = `/${uploadedImageFile.path.replace(/\\/g, "/")}`;
	} else {
		enteredProduct.imagePath = existingProduct.imagePath;
	}
	const productIsValid = productValidation.productIsValid(enteredProduct);
	if (!productIsValid) {
		validationSession.flashErrorsToSession(
			req,
			{
				hasError: true,
				message: `Invalid Product.`,
				name: enteredName,
				summary: enteredSummary,
				description: enteredDescription,
				imagePath: enteredProduct.imagePath,
				price: enteredPrice,
			},
			function () {
				res.redirect(`/admin/products/${productId}`);
			}
		);
		return;
	}
	if (!existingProduct.equals(enteredProduct)) {
		await enteredProduct.update();
		if (enteredProduct.imagePath !== existingProduct.imagePath) {
			await fsPromises.unlink(path.join(__basedir, existingProduct.imagePath));
		}
	}

	return res.redirect(`/admin/products`);
}

function getNewProductForm(req, res) {
	const sessionErrorData = validationSession.getSessionErrorData(req, {
		name: "",
		imagePath: "",
		summary: "",
		price: 0,
		description: "",
	});
	return res.render("admin/products/new-product-form", {
		inputData: sessionErrorData,
	});
}

async function deleteProduct(req, res) {
	const { id: productId } = req.params;
	// to consider: delete requirements: should not be on an open order.
	const existingProduct = new Product(null, null, null, null, null, productId);
	await existingProduct.fetch();
	const result = await existingProduct.delete();
	if (result.acknowledged && result.deletedCount === 1) {
		await fsPromises.unlink(path.join(__basedir, existingProduct.imagePath));
	}
	res.redirect("/admin/products");
}

module.exports = {
	getSingleProduct,
	getProducts,
	createProduct,
	getNewProductForm,
	saveProduct,
	deleteProduct,
};
