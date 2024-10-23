import { BaseModel } from './BaseModel';
import { ValidateResult } from '../class/ValidateResult';

export class Version extends BaseModel {
	readonly TYPE_DEFAULT = 1;

	constructor(db: D1Database) {
		super('version', db); // Pass the table name to the base model
	}

	validate(data: any) {
		const fields = this.fields(data);
		if (!fields.type || !fields.version) {
			return new ValidateResult(false, "Type or version is empty!");
		}

		return new ValidateResult(true, null, fields);
	}

	fields(data: any) {
		return {
			type: data?.type || this.TYPE_DEFAULT as number,
			version: data?.version as string,
			updated_at: Date.now(),
		}
	}
}
