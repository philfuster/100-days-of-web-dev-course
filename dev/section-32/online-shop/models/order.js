const mongodb = require("mongodb");
const db = require("../data/database");
const bcrypt = require("bcryptjs");

const { ObjectId } = mongodb;

class Order {
	constructor(user, date, items, status, id) {
		this.user = user;
		this.date = date;
		this.items = items;
		this.status = status;
		if (id) {
			this.id = new ObjectId(id);
		}
	}

	async fetch() {
		const order = await db
			.getDb()
			.collection("orders")
			.findOne({ _id: this.id });
		if (order == null) return null;
		this.user = order.user;
		this.summary = order.summary;
		this.date = order.date;
		this.items = order.items;
		this.status = order.status;
	}

	async save() {
		const result = await db.getDb().collection("orders").insertOne({
			user: this.user,
			date: this.date,
			items: this.items,
			status: this.status,
		});
		return result;
	}
}

module.exports = Order;
