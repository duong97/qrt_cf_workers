import { BaseModel } from './BaseModel';
import { ValidateResult } from '../class/ValidateResult';

export class Category extends BaseModel {
	constructor(db: D1Database) {
		super('categories', db); // Pass the table name to the base model
	}

	validate(data: any, id?: number) {
		const fields = this.removeUndefinedValue(this.fields(data));
		if (!id && !fields.name) {
			return new ValidateResult(false, "Tên không được để trống");
		}

		return new ValidateResult(true, null, fields);
	}

	fields(data: any) {
		return {
			name: data?.name as string,
		}
	}

	formatResponse(result: any): any {
		return result;
	}
}
