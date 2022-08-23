const mongodb = require("mongodb");
const db = require("../data/database");
const bcrypt = require("bcryptjs");
const { ObjectId } = mongodb;

class User {
	constructor(email, password, fullName, street, postalCode, city, id) {
		this.email = email;
		this.password = password;
		this.fullName = fullName;
		this.street = street;
		this.postalCode = postalCode;
		this.city = city;
		this.isAdmin = false;
		if (id) {
			this.id = new ObjectId(id);
		}
	}

	async fetch() {
		const existingUser = await db
			.getDb()
			.collection("users")
			.findOne({ _id: this.id });
		if (existingUser == null) return null;
		this.email = existingUser.email;
		this.fullName = existingUser.fullName;
		this.street = existingUser.street;
		this.postalCode = existingUser.postalCode;
		this.city = existingUser.city;
		this.password = existingUser.password;
		this.isAdmin = existingUser.isAdmin;
	}

	async getUserWithSameEmail() {
		const existingUser = await db
			.getDb()
			.collection("users")
			.findOne({ email: this.email });
		return existingUser;
	}

	async existsAlready() {
		const existingUser = await this.getUserWithSameEmail();
		if (existingUser) {
			return true;
		} else {
			return false;
		}
	}

	async save() {
		const hashedPassword = await bcrypt.hash(this.password, 12);
		this.password = hashedPassword;

		const result = await db.getDb().collection("users").insertOne({
			email: this.email,
			password: this.password,
			fullName: this.fullName,
			street: this.street,
			postalCode: this.postalCode,
			city: this.city,
			isAdmin: this.isAdmin,
		});

		return result;
	}

	async login(comparePassword) {
		const passwordsAreEqual = await bcrypt.compare(
			this.password,
			comparePassword
		);
		return passwordsAreEqual;
	}
}

module.exports = User;
