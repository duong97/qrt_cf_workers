import { BaseModel } from './BaseModel';

export class Product extends BaseModel {
	constructor(db: D1Database) {
		super('products', db); // Pass the table name to the base model
	}
}
