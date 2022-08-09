const mongodb = require("mongodb");
const db = require("../data/database");
const bcrypt = require("bcryptjs");

const { ObjectId } = mongodb;

class User {
	constructor(
		email,
		password,
		confirmEmail,
		fullName,
		street,
		postalCode,
		city
	) {
		this.email = email;
		this.confirmEmail = confirmEmail;
		this.password = password;
		this.fullName = fullName;
		this.street = street;
		this.postalCode = postalCode;
		this.city = city;
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
