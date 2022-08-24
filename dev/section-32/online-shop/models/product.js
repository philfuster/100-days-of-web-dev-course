const mongodb = require("mongodb");
const db = require("../data/database");

const { ObjectId } = mongodb;

class Product {
	constructor(name, summary, price, imagePath, description, id) {
		this.name = name;
		this.summary = summary;
		this.price = price;
		this.imagePath = imagePath;
		this.description = description;
		if (id) {
			this.id = new ObjectId(id);
		}
	}

	static async fetchAll() {
		const products = await db.getDb().collection("products").find({}).toArray();
		return products;
	}

	async fetch() {
		const product = await db
			.getDb()
			.collection("products")
			.findOne({ _id: this.id });
		if (product == null) return null;
		this.name = product.name;
		this.summary = product.summary;
		this.description = product.description;
		this.price = product.price;
		this.imagePath = product.imagePath;
	}

	async getProductWithSameName() {
		const existingProduct = await db
			.getDb()
			.collection("products")
			.findOne({ name: this.name });
		return existingProduct;
	}

	async existsAlready() {
		const existingProduct = await this.getProductWithSameName();
		if (existingProduct) {
			return true;
		} else {
			return false;
		}
	}

	async create() {
		const result = await db.getDb().collection("products").insertOne({
			name: this.name,
			summary: this.summary,
			description: this.description,
			imagePath: this.imagePath,
			price: this.price,
		});
		return result;
	}

	async update() {
		const result = await db
			.getDb()
			.collection("products")
			.updateOne(
				{ _id: this.id },
				{
					$set: {
						name: this.name,
						summary: this.summary,
						description: this.description,
						imagePath: this.imagePath,
						price: this.price,
					},
				}
			);
		return result;
	}

	equals(product) {
		return (
			product.name === this.name &&
			product.price === this.price &&
			product.description === this.description &&
			product.summary === this.summary &&
			product.imagePath === this.imagePath
		);
	}

	async delete() {
		if (this.id == null) return;
		const result = await db
			.getDb()
			.collection("products")
			.deleteOne({ _id: this.id });
		return result;
	}
}

module.exports = Product;
