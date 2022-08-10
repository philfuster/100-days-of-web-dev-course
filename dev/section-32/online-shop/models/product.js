const mongodb = require('mongodb');
const db = require('../data/database');
const bcrypt = require('bcryptjs');

class Product {
	constructor(
		name,
		summary,
		price,
		image,
		description
	) {
		this.name = name;
		this.summary = summary;
		this.price = price;
		this.image = image;
		this.description = description;
	}

	static async fetchAll() {
		const products = await db.getDb().collection('products').find({}).toArray();
		return products;
	}
}

module.exports = Product;
