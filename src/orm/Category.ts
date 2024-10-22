import { BaseModel } from './BaseModel';
import { ValidateResult } from '../class/ValidateResult';

export class Category extends BaseModel {
	constructor(db: D1Database) {
		super('categories', db); // Pass the table name to the base model
	}

	validate(data: any) {
		if (!data.name) {
			return new ValidateResult(false, "Tên không được để trống");
		}

		return new ValidateResult(true);
	}

	// @todo get only property of object like name only when create category
}
