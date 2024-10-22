import { BaseModel } from '../orm/BaseModel';

export class BaseRoute {
	method: string;
	model: BaseModel;
	id?: any;
	data?: any;

	constructor(method: string, model: BaseModel, id?: any, data?: any) {
		this.method = method;
		this.model = model;
		this.id = id;
		this.data = data
	}

	async route() {
		switch (this.method.toLowerCase()) {
			case 'get':
				return await this.get();
			case 'post':
				return await this.post();
		}
	}

	async get() {
		if (this.id) {
			return await this.model.findById(this.id);
		} else {
			return await this.model.findAll();
		}
	}

	async post() {
		return await this.model.create(this.data);
	}
}
