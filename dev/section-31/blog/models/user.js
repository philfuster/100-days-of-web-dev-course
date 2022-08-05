const mongodb = require("mongodb");
const db = require('../data/database');
const bcrypt = require("bcryptjs");

const { ObjectId } = mongodb;

class User {
	constructor(email, password) {
		this.email = email;
		this.password = password;
	}

	static async fetchAll() {
		const users = await db.getDb().collection("users").find({}).toArray();
		return users;
	}

	async getUserWithSameEmail() {
		const existingUser = await db.getDb().collection("users").findOne({email: this.email});
		return existingUser;
	}

	async existsAlready() {
		const existingUser = this.getUserWithSameEmail();
		if (existingUser) {
			return true;
		} else {
			return false;
		}
	}

	async create() {
		const hashedPassword = await bcrypt.hash(this.password, 12);
		this.password = hashedPassword;

		const result = await db.getDb().collection("users").insertOne({
			email: this.email,
			password: hashedPassword
		})
		return result;
	}

	async comparePassword(enteredPassword) {
		if (this.password == null) return false;
		const result = await bcrypt.compare(enteredPassword, this.password);
		return result;
	}

	async delete() {
		if (!this.id) {
			return;
		}
		const result = await db.getDb().collection("users").deleteOne({
			_id: this.id,
		})
		return result;
	}
}

module.exports = User;
