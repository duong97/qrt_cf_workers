import { ValidateResult } from '../class/ValidateResult';

export abstract class BaseModel {
	tableName: string;
	db: D1Database;

	protected constructor(tableName: string, db: D1Database) {
		this.tableName = tableName;
		this.db = db;
	}

	abstract validate(data: any): ValidateResult;

	async findAll() {
		const query = `SELECT * FROM ${this.tableName}`;
		const { results } = await this.db.prepare(query).all();
		return results;
	}

	async findById(id: string|number) {
		const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
		return await this.db.prepare(query).bind(id).first();
	}

	async create(data: any) {
		const validate = this.validate(data);
		if (validate.hasError()) {
			return validate;
		}
		const keys = Object.keys(data).join(', ');
		const values = Object.values(data);
		const placeholders = values.map(() => '?').join(', ');
		const query = `INSERT INTO ${this.tableName} (${keys}) VALUES (${placeholders})`;

		return await this.db.prepare(query).bind(...values).run();
	}

	async update(id: number, data: any) {
		const validate = this.validate(data);
		if (validate.hasError()) {
			return validate;
		}

		const updates = Object.keys(data).map((key) => `${key} = ?`).join(', ');
		const values = [...Object.values(data), id];
		const query = `UPDATE ${this.tableName} SET ${updates} WHERE id = ?`;

		return await this.db.prepare(query).bind(...values).run();
	}

	async delete(id: number) {
		const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
		return await this.db.prepare(query).bind(id).run();
	}
}
