const Product = require("../models/product");
const validationSession = require("../util/validation.session");
async function getProducts(req, res) {
	const products = await Product.fetchAll();
	return res.render("admin/products", { products });
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
		price: "",
		description: "",
	});
	const inputData = {
		name: sessionErrorData.name || existingProduct.name,
		imagePath: sessionErrorData.imagePath || existingProduct.imagePath,
		summary: sessionErrorData.summary || existingProduct.summary,
		description: sessionErrorData.description || existingProduct.description,
		price: sessionErrorData.price || existingProduct.price,
	};
	return res.render("admin/product-form", {
		product: existingProduct,
		inputData,
	});
}

async function saveNewProduct(req, res) {
	const { id: productId } = req.params;
	const { file: uploadedImageFile } = req;
	const {
		name: enteredName,
		summary: enteredSummary,
		price: enteredPrice,
		description: enteredDescription,
	} = req.body;
	const product = new Product(
		enteredName,
		enteredSummary,
		enteredPrice,
		uploadedImageFile.path,
		enteredDescription,
		productId
	);
	const productIsValid = productValidation.productIsValid(product);
	if (!productIsValid) {
		validationSession.flashErrorsToSession(
			req,
			{
				message: `Invalid Product.`,
				name: enteredName,
				summary: enteredSummary,
				description: enteredDescription,
				imagePath: uploadedImageFile.path,
				price: enteredPrice,
			},
			function () {
				res.redirect(`/admin/products/${productId}`);
			}
		);
		return;
	}
	const existingProduct = product.getProductWithSameName();
	if (!existingProduct.id.equals(productId)) {
		validationSession.flashErrorsToSession(
			req,
			{
				message: `Invalid Product. Product Title already exists.`,
				name: enteredName,
				summary: enteredSummary,
				description: enteredDescription,
				price: enteredPrice,
				description: enteredDescription,
			},
			function () {
				res.redirect(`/admin/products/${productId}`);
			}
		);
		return;
	}
	await product.save();

	return res.redirect(`/admin/products`);
}

function getNewProductForm(req, res) {
	const sessionErrorData = validationSession.getSessionErrorData(req, {
		name: "",
		imagePath: "",
		summary: "",
		price: "",
		description: "",
	});
	return res.render("admin/new-product-form", {
		inputData: sessionErrorData,
	});
}

module.exports = {
	getSingleProduct,
	getProducts,
	saveNewProduct,
	getNewProductForm,
};
