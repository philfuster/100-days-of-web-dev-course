const mongodb = require("mongodb");
const db = require("../data/database");

const { ObjectId } = mongodb;

class Order {
	static validOrderStatuses = {
		PENDING: "PENDING",
		FULFILLED: "FULFILLED",
		CANCELED: "CANCELED",
	};
	constructor(user, date, items, totalPrice, totalQuantity, status, id) {
		this.user = user;
		this.date = date;
		this.items = items;
		this.status = status;
		this.totalPrice = parseFloat(Number(totalPrice).toFixed(2));
		this.totalQuantity = parseInt(Number(totalQuantity).toFixed(0));
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

	static async fetchAll() {
		const orders = await db.getDb().collection("orders").find({}).toArray();
		return orders;
	}

	async fetch() {
		const order = await db
			.getDb()
			.collection("orders")
			.findOne({ _id: this.id });
		if (order == null) return null;
		this.user = order.user;
		this.date = order.date;
		this.items = order.items;
		this.totalPrice = order.totalPrice;
		this.totalQuantity = order.totalQuantity;
		this.status = order.status;
	}

	async save() {
		if (!Order.validOrderStatuses.hasOwnProperty(this.status)) {
			throw "Invalid status provided!!";
		}
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

	async updateStatus() {
		if (!Order.validOrderStatuses.hasOwnProperty(this.status)) {
			throw "Invalid status provided!!";
		}
		const result = await db
			.getDb()
			.collection("orders")
			.updateOne(
				{ _id: this.id },
				{
					$set: {
						status: this.status,
					},
				}
			);
		return result;
	}
}

module.exports = Order;
