export class ResponseData {
	success: boolean;
	data: any;

	constructor(success: boolean, data: any = null) {
		this.success = success;
		this.data = data;
	}
}
