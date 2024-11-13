interface GithubCommitContentInfo {
	name: string; // 'thumbnail.png',
	path: string; // 'public/images/products/6/thumbnail.png',
	sha: string; // 'dd6c17fa11e4a396b3299c00052799d628691e5f',
	size: number; // 489320,
	url: string; // 'https://api.github.com/repos/duong97/qrt/contents/public/images/products/6/thumbnail.png?ref=main',
	html_url: string; // 'https://github.com/duong97/qrt/blob/main/public/images/products/6/thumbnail.png',
	git_url: string; // 'https://api.github.com/repos/duong97/qrt/git/blobs/dd6c17fa11e4a396b3299c00052799d628691e5f',
	download_url: string; // 'https://raw.githubusercontent.com/duong97/qrt/main/public/images/products/6/thumbnail.png?token=AGM3UFXF4OYLDOK7Y6D4UB3HF6CTK',
	type: string; // 'file',
	// '_links': {
	// 	'self': 'https://api.github.com/repos/duong97/qrt/contents/public/images/products/6/thumbnail.png?ref=main',
	// 	'git': 'https://api.github.com/repos/duong97/qrt/git/blobs/dd6c17fa11e4a396b3299c00052799d628691e5f',
	// 	'html': 'https://github.com/duong97/qrt/blob/main/public/images/products/6/thumbnail.png'
	// }
}

interface GithubCommitInfoDetail {
	sha: string; // '5793758d1c985f7190ecbcbdd40779762601b4da',
	node_id: string; // 'C_kwDOMsQrH9oAKDU3OTM3NThkMWM5ODVmNzE5MGVjYmNiZGQ0MDc3OTc2MjYwMWI0ZGE',
	url: string; // 'https://api.github.com/repos/duong97/qrt/git/commits/5793758d1c985f7190ecbcbdd40779762601b4da',
	html_url: string; // 'https://github.com/duong97/qrt/commit/5793758d1c985f7190ecbcbdd40779762601b4da',
	// 'author': { 'name': 'auto', 'email': 'admin@admin.com', 'date': '2024-11-09T15:51:21Z' },
	// 'committer': { 'name': 'auto', 'email': 'admin@admin.com', 'date': '2024-11-09T15:51:21Z' },
	// 'tree': {
	// 	'sha': 'cdcddeb91d1010cb904d47c1d09a2f37d45f8583',
	// 	'url': 'https://api.github.com/repos/duong97/qrt/git/trees/cdcddeb91d1010cb904d47c1d09a2f37d45f8583'
	// },
	// 'message': '[Auto] Upload image share_template_old.png',
	// 'parents': [{
	// 	'sha': '84cd466e69215329b76fa90f61fce52fab6b45e0',
	// 	'url': 'https://api.github.com/repos/duong97/qrt/git/commits/84cd466e69215329b76fa90f61fce52fab6b45e0',
	// 	'html_url': 'https://github.com/duong97/qrt/commit/84cd466e69215329b76fa90f61fce52fab6b45e0'
	// }],
	// 'verification': { 'verified': false, 'reason': 'unsigned', 'signature': null, 'payload': null, 'verified_at': null }
}

interface GithubCommitInfo {
	content: GithubCommitContentInfo,
	commit: GithubCommitInfoDetail
}

interface GithubFileInfo {
	name: string; // thumbnail.png,
	path: string; // public/images/products/6/thumbnail.png,
	sha: string; // dd6c17fa11e4a396b3299c00052799d628691e5f,
	size: string; // 489320,
	url: string; // https://api.github.com/repos/duong97/qrt/contents/public/images/products/6/thumbnail.png?ref=main,
	html_url: string; // https://github.com/duong97/qrt/blob/main/public/images/products/6/thumbnail.png,
	git_url: string; // https://api.github.com/repos/duong97/qrt/git/blobs/dd6c17fa11e4a396b3299c00052799d628691e5f,
	download_url: string; // https://raw.githubusercontent.com/duong97/qrt/main/public/images/products/6/thumbnail.png?token=AGM3UFVYOG4XLO45WXMBCC3HF6BW2,
	type: string; // file,
	content: string; // '',
	encoding: string; // base64,
	// _links: {
	// 	self: https://api.github.com/repos/duong97/qrt/contents/public/images/products/6/thumbnail.png?ref=main,
	// 	git: https://api.github.com/repos/duong97/qrt/git/blobs/dd6c17fa11e4a396b3299c00052799d628691e5f,
	// 	html: https://github.com/duong97/qrt/blob/main/public/images/products/6/thumbnail.png
	// }
}

export default class GithubHelper {
	private readonly token: string;
	private readonly branch: string;
	private readonly baseApiUrl: string;
	private readonly imagePath: string = '/public/images';
	private readonly commiter: object = {
		name: 'duong97',
		email: 'nvduong15@gmail.com',
	};

	constructor(env: Env) {
		this.token = env.GITHUB_TOKEN;
		this.branch = env.GITHUB_BRANCH;
		this.baseApiUrl = env.GITHUB_BASE_API_URL;
	}

	private async makeRequest(url: string, method: string, data?: object) {
		const reqOption = {
			method: method,
			headers: {
				Authorization: `Bearer ${this.token}`,
				'Content-Type': 'application/json',
				'User-Agent': 'CloudFlare workers'
			},
			body: JSON.stringify(data),
		};
		return await fetch(url, reqOption);
	}

	private async convertFileToBase64(file: File) {
		const fileArrayBuffer = await file.arrayBuffer();
		let string = '';
		(new Uint8Array(fileArrayBuffer)).forEach(
			(byte) => { string += String.fromCharCode(byte) }
		)
		return btoa(string);
	}

	private getFileInfoApiUrl(path2save: string) {
		return this.baseApiUrl + this.imagePath + path2save + `?ref=${this.branch}`;
	}

	// Get github file info
	async getFileInfo(path2save: string): Promise<GithubFileInfo | null> {
		const getFileResponse = await this.makeRequest(this.getFileInfoApiUrl(path2save), 'GET');
		if (getFileResponse.ok) {
			return await getFileResponse.json() as GithubFileInfo;
		}
		return null;
	}

	// Upload file to github
	async uploadFile(file: File, path2save: string): Promise<string | null> {
		let fileInfo = await this.getFileInfo(path2save);

		const payload = {
			message: `[Auto] Upload image [${file.name}] to [${path2save}]`,
			branch: this.branch,
			committer: this.commiter,
			content: await this.convertFileToBase64(file),
			sha: fileInfo?.sha
		};
		const apiUrl = this.baseApiUrl + this.imagePath + path2save;
		const response = await this.makeRequest(apiUrl, 'PUT', payload);

		const result = await response.json() as GithubCommitInfo;
		return result?.content?.download_url || null;
	}
}
