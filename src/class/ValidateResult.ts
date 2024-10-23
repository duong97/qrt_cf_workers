export class ValidateResult {
	success: boolean;
	message?: string;
	fields?: any;

	constructor(success: boolean, message?: any, fields?: any) {
		this.success = success;
		this.message = message;
		this.fields = fields;
	}

	hasError() {
		return !this.success;
	}
}
