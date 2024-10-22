import { ResponseData } from '../class/ResponseData';
import { Category } from '../orm/Category';
import { BaseRoute } from './BaseRoute';
import { Product } from '../orm/Product';
import { ProductOption } from '../orm/ProductOption';
import { Version } from '../orm/Version';

export default  {
	async routeConfig(request: Request, env :Env) {
		const { pathname } = new URL(request.url);
		let model = null;

		switch (pathname) {
			case "/api/categories":
				model = new Category(env.D1_DB);
				break;
			case "/api/products":
				model = new Product(env.D1_DB)
				break;
			case "/api/options":
				model = new ProductOption(env.D1_DB)
				break;
			case "/api/menu_version":
				model = new Version(env.D1_DB)
				break;
		}

		let route = null;
		if (model) {
			const { searchParams } = new URL(request.url);
			const bodyData = await request.json().then( r => r);
			route = new BaseRoute(request.method, model, searchParams.get('id'), bodyData);
		}

		const routingData = await route?.route();
		return new ResponseData(!!route, routingData);
	}
}
