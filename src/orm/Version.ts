import { BaseModel } from './BaseModel';

export class Version extends BaseModel {
	constructor(db: D1Database) {
		super('version', db); // Pass the table name to the base model
	}
}
