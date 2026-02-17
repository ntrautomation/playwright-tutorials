import BaseApi from "./baseApi";

type TokenResponse = {
	access_token: string;
	token_type: string;
	expires_at: number;
	refresh_token?: string;
	user?: unknown;
};

class TokenGeneration extends BaseApi {
	constructor(apiRequestContext) {
		super(apiRequestContext);
	}

	async generateToken() {
		//Validate env variables if they exist before usage
		const url = process.env.TOKEN_URL;
		const apiKey = process.env.API_KEY;

		const res = await this.apiRequestContext.post(url, {
			headers: {
				apiKey: apiKey,
				"Content-Type": "application/json",
			},
			data: {
				email: process.env.EMAIL,
				password: process.env.PASSWORD,
			},
		});

		const bodyText = await res.text();

		const json = JSON.parse(bodyText) as TokenResponse;

		if (!json.access_token) throw new Error(`No access toekn in reponse ${bodyText}`);

		return json;
	}
}
export default TokenGeneration;
