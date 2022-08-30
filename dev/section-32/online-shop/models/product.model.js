const mongodb = require("mongodb");
const db = require("../data/database");

const { ObjectId } = mongodb;

class Product {
	constructor(productData) {
		this.title = productData.title;
		this.summary = productData.summary;
		this.price = parseFloat(Number(productData.price).toFixed(2));
		this.image = productData.image;
		this.updateImageData();
		this.description = productData.description;
		if (productData._id) {
			this.id = productData._id.toString();
		}
	}

	static async fetchAll() {
		const products = await db.getDb().collection("products").find().toArray();
		return products.map(function (productDocument) {
			return new Product(productDocument);
		});
	}

	static async findById(productId) {
		let prodId;
		try {
			prodId = new ObjectId(productId);
		} catch (error) {
			error.code = 404;
			throw error;
		}
		const product = await db
			.getDb()
			.collection("products")
			.findOne({ _id: prodId });
		if (!product) {
			const error = new Error("Could not find product with provided id.");
			error.code = 404;
			throw error;
		}

		return new Product(product);
	}

	static async findMultiple(ids) {
		const productIds = ids.map(function (id) {
			return new mongodb.ObjectId(id);
		});
		const products = await db
			.getDb()
			.collection("products")
			.find({ _id: { $in: productIds } })
			.toArray();

		return products.map(function (productDocument) {
			return new Product(productDocument);
		});
	}

	updateImageData() {
		this.imagePath = `product-data/images/${this.image}`;
		this.imageUrl = `/products/assets/images/${this.image}`;
	}

	async getProductWithSameTitle() {
		const existingProduct = await db
			.getDb()
			.collection("products")
			.findOne({ title: this.title });
		if (existingProduct == null) return;
		return new Product(existingProduct);
	}

	async existsAlready() {
		const existingProduct = await this.getProductWithSameTitle();
		if (existingProduct) {
			return true;
		} else {
			return false;
		}
	}

	async save() {
		const productData = {
			title: this.title,
			summary: this.summary,
			price: this.price,
			description: this.description,
			image: this.image,
		};

		if (this.id) {
			const productId = new ObjectId(this.id);
			if (!this.image) {
				delete productData.image;
			}
			await db
				.getDb()
				.collection("products")
				.updateOne({ _id: productId }, { $set: productData });
		} else {
			await db.getDb().collection("products").insertOne(productData);
		}
	}

	async replaceImage(newImage) {
		this.image = newImage;
		this.updateImageData();
	}

	equals(product) {
		return (
			product.title === this.title &&
			product.price === this.price &&
			product.description === this.description &&
			product.summary === this.summary &&
			product.image === this.image
		);
	}

	remove() {
		const productId = new mongodb.ObjectId(this.id);
		return db.getDb().collection("products").deleteOne({ _id: productId });
	}
}

module.exports = Product;
