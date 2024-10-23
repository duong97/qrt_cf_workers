import { ValidateResult } from '../class/ValidateResult';

export abstract class BaseModel {
	tableName: string;
	db: D1Database;

	protected constructor(tableName: string, db: D1Database) {
		this.tableName = tableName;
		this.db = db;
	}

	abstract validate(data: any): ValidateResult;
	abstract fields(data: any): any;

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

		const keys = Object.keys(validate.fields).join(', ');
		const values = Object.values(validate.fields);
		const placeholders = values.map(() => '?').join(', ');
		const query = `INSERT INTO ${this.tableName} (${keys}) VALUES (${placeholders})`;

		try {
			return await this.db.prepare(query).bind(...values).run();
		} catch (error: any) {
			return new ValidateResult(false, error?.message);
		}
	}

	async createMultiple(data: any) {
		for (const row of data) {
			const validate = this.validate(row);
			if (validate.hasError()) {
				return validate;
			}
		}

		let result = [];
		for (const row of data) {
			result.push(await this.create(row));
		}
		return result;
	}

	async update(id: number, data: any) {
		if (!id) {
			return new ValidateResult(false, "Missing id value");
		}

		const validate = this.validate(data);
		if (validate.hasError()) {
			return validate;
		}

		const updates = Object.keys(validate.fields).map((key) => `${key} = ?`).join(', ');
		const values = [...Object.values(validate.fields), id];
		const query = `UPDATE ${this.tableName} SET ${updates} WHERE id = ?`;

		try {
			return await this.db.prepare(query).bind(...values).run();
		} catch (error: any) {
			return new ValidateResult(false, error?.message);
		}
	}

	async delete(id: number) {
		if (!id) {
			return new ValidateResult(false, "Missing id value");
		}

		const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
		return await this.db.prepare(query).bind(id).run();
	}
}
