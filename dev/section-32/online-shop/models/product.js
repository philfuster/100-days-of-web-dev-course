const mongodb = require("mongodb");
const db = require("../data/database");
const bcrypt = require("bcryptjs");

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
		if (product) {
			this.name = product.name;
			this.summary = product.summary;
			this.description = product.description;
			this.price = product.price;
			this.imagePath = product.imagePath;
		}
	}
}

module.exports = Product;
