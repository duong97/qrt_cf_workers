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
			case 'delete':
				return await this.delete();
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
		if (this.id) {
			// Update
			return await this.model.update(this.id, this.data);
		} else {
			// Create
			if (Array.isArray(this.data)) {
				return await this.model.createMultiple(this.data);
			} else {
				return await this.model.create(this.data);
			}
		}
	}

	async delete() {
		return await this.model.delete(this.id);
	}
}
