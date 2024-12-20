import { BaseModel } from './BaseModel';
import { ValidateResult } from '../class/ValidateResult';

export class Product extends BaseModel {
	constructor(db: D1Database) {
		super('products', db); // Pass the table name to the base model
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
			price: data?.price as number,
			description: data?.description as string,
			thumbnail: data?.thumbnail as string,
			category: data?.category as number,
			options: (data?.options ? JSON.stringify(data?.options) : undefined) as string,
		};
	}

	formatResponse(result: any): any {
		// Format options as array
		result.options = this.toArray(result.options);

		return result;
	}
}
