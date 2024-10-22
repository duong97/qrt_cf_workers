export class ValidateResult {
	success: boolean;
	message?: string;

	constructor(success: boolean, message: any = null) {
		this.success = success;
		this.message = message;
	}

	hasError() {
		return !this.success;
	}
}
