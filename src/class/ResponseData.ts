export class ResponseData {
	success: boolean;
	data: any;
	isFileUploaded: boolean = false;

	constructor(success: boolean, data: any = null) {
		this.success = success;
		this.data = data;
	}

	markAsFileUploaded() {
		this.isFileUploaded = true;
	}
}
