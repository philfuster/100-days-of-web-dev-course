const mongodb = require("mongodb");
const db = require("../data/database");
const bcrypt = require("bcryptjs");

const { ObjectId } = mongodb;

class Order {
	constructor(user, date, items, totalPrice, totalQuantity, status, id) {
		this.user = user;
		this.date = date;
		this.items = items;
		this.status = status;
		this.totalPrice = totalPrice;
		this.totalQuantity = totalQuantity;
		if (id) {
			this.id = new ObjectId(id);
		}
	}

	static async getOrdersWithSameUser(userId) {
		const orders = await db
			.getDb()
			.collection("orders")
			.find({ "user.id": new ObjectId(userId) })
			.toArray();
		return orders;
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
		this.totalPrice = order.totalPrice;
		this.totalQuantity = order.totalQuantity;
		this.status = order.status;
	}

	async save() {
		const result = await db.getDb().collection("orders").insertOne({
			user: this.user,
			date: this.date,
			items: this.items,
			totalPrice: this.totalPrice,
			totalQuantity: this.totalQuantity,
			status: this.status,
		});
		return result;
	}
}

module.exports = Order;
