const mongodb = require("mongodb");
const db = require("../data/database");
const bcrypt = require("bcryptjs");
const { ObjectId } = mongodb;

class User {
	constructor(email, password, fullName, street, postalCode, city) {
		this.email = email;
		this.password = password;
		this.name = fullName;
		this.address = {
			street: street,
			postalCode: postalCode,
			city: city,
		};
		this.isAdmin = false;
	}

	static findById(userId) {
		const uid = new mongodb.ObjectId(userId);

		return db
			.getDb()
			.collection("users")
			.findOne({ _id: uid }, { projection: { password: 0 } });
	}

	getUserWithSameEmail() {
		return db.getDb().collection("users").findOne({ email: this.email });
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
			name: this.name,
			address: this.address,
			isAdmin: this.isAdmin,
		});

		return result;
	}

	async hasMatchingPassword(comparePassword) {
		const passwordsAreEqual = await bcrypt.compare(
			this.password,
			comparePassword
		);
		return passwordsAreEqual;
	}
}

module.exports = User;
