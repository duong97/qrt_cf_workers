import { BaseModel } from './BaseModel';
import { ValidateResult } from '../class/ValidateResult';

export class ProductOption extends BaseModel {
	constructor(db: D1Database) {
		super('options', db); // Pass the table name to the base model
	}

	validate(data: any) {
		const fields = this.fields(data);
		if (!fields.name) {
			return new ValidateResult(false, "Tên không được để trống");
		}

		return new ValidateResult(true, null, fields);
	}

	fields(data: any) {
		return {
			name: data?.name as string,
			multiple: data?.multiple as boolean,
			items: JSON.stringify(data?.items || {}) as string,
		}
	}
}
