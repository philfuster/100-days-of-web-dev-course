const mongodb = require("mongodb");
const db = require("../data/database");

const { ObjectId } = mongodb;

class Product {
	constructor(productData) {
		const { title, summary, price, image, description, _id } = productData;
		this.title = title;
		this.summary = summary;
		this.price = parseFloat(Number(price).toFixed(2));
		this.image = image;
		this.updateImageData();
		this.description = description;
		if (_id) {
			this.id = _id.toString();
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

	updateImageData() {
		this.imagePath = `product-data/images/${this.image}`;
		this.imageUrl = `/products/assets/images/${this.image}`;
	}

	async getProductWithSameTitle() {
		const existingProduct = await db
			.getDb()
			.collection("products")
			.findOne({ title: this.title });
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
