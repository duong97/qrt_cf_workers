import { BaseModel } from './BaseModel';

export class ProductOption extends BaseModel {
	constructor(db: D1Database) {
		super('options', db); // Pass the table name to the base model
	}
}
