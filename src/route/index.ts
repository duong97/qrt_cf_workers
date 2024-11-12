import { ResponseData } from '../class/ResponseData';
import { Category } from '../orm/Category';
import { BaseRoute } from './BaseRoute';
import { Product } from '../orm/Product';
import { ProductOption } from '../orm/ProductOption';
import { Version } from '../orm/Version';
import GithubHelper from '../helper/GithubHelper';

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
		let bodyData = null;
		const { searchParams } = new URL(request.url);
		const id = searchParams.get('id');
		if (model) {
			route = true;
			try {
				bodyData = Object.fromEntries(await request.formData());
			} catch (e: any) {
				// console.log("Error in parse body json: " + e?.message);
			}
			route = new BaseRoute(request.method, model, id, bodyData);
		}

		const routingData = await route?.route();
		const responseData = new ResponseData(!!route, routingData);

		// Upload image after save data
		const lastRowId = routingData?.meta?.last_row_id || id;
		const file = bodyData?.file;
		if (file instanceof File && lastRowId && model) {
			const githubHelper = new GithubHelper(env);
			const baseImagePath = '/images';
			const fileExt = file.name.split('.').pop();
			let updatedData = {};

			// Upload base on API
			switch (pathname) {
				case "/api/products":
					const path2save = `/products/${lastRowId}/thumbnail.${fileExt}`;
					const uploadedUrl = await githubHelper.uploadFile(file, path2save);
					if (uploadedUrl) {
						// Upload success
						updatedData = {
							thumbnail: baseImagePath + path2save
						};
						responseData.markAsFileUploaded();
					}
					break;
			}

			// Update image path
			if (Object.values(updatedData).length > 0) {
				await model.update(lastRowId, updatedData)
			}
		}

		return responseData;
	}
}
