const mongodb = require("mongodb");
const db = require('../data/database');
const bcrypt = require("bcryptjs");

const { ObjectId } = mongodb;

class User {
	constructor(email, password, id) {
		this.email = email;
		this.password = password;
		if (id) {
			this.id = new ObjectId(id);
		}
	}

	static async fetchAll() {
		const users = await db.getDb().collection("users").find({}).toArray();
		return users;
	}

	async fetch() {
		const user = await db.getDb().collection("users").findOne({_id: this.id});
		this.email = user.email;
		this.password = user.password;
	}

	async fetchByEmail() {
		const user = await db.getDb().collection("users").findOne({email: this.email});
		if (user == null) return;

		this.id = user._id;
		this.password = user.password;
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

	async updatePassword(){
		const hashedPassword = await bcrypt.hash(this.password, 12);
		if (this.id == null) return;
		result = await db.getDb().collection("users").updateOne(
			{
				_id: this.id,
			},
			{
				$set: {
					password: hashedPassword,
				}
			}
		)
	}

	async updateEmail() {
		if (this.id == null) return;
		result = await db.getDb().collection("users").updateOne(
			{
				_id: this.id,
			},
			{
				$set: {
					email: this.email,
				}
			}
		)
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
