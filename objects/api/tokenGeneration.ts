import BaseApi from "./baseApi";

type TokenResponse = {
	access_token: string;
	token_type: string;
	expires_at: number;
	refresh_token?: string;
	user?: unknown;
};

class TokenGeneration extends BaseApi {
	constructor(apiRequestContext: any) {
		super(apiRequestContext);
	}

	async generateToken(): Promise<TokenResponse> {
		const url = process.env.TOKEN_URL;
		const apiKey = process.env.API_KEY;
		const email = process.env.EMAIL;
		const password = process.env.PASSWORD;

		const missingVars = [];
		if (!url) missingVars.push("TOKEN_URL");
		if (!apiKey) missingVars.push("API_KEY");
		if (!email) missingVars.push("EMAIL");
		if (!password) missingVars.push("PASSWORD");

		if (missingVars.length > 0) {
			throw new Error(
				`Missing required environment variables: ${missingVars.join(", ")}`
			);
		}

		const res = await this.apiRequestContext.post(url, {
			headers: {
				apiKey: apiKey,
				"Content-Type": "application/json",
			},
			data: {
				email: email,
				password: password,
			},
		});

		const bodyText = await res.text();

		let json: TokenResponse;
		try {
			json = JSON.parse(bodyText);
		} catch {
			throw new Error(`Invalid JSON response from token endpoint: ${bodyText}`);
		}

		if (!json.access_token) {
			throw new Error(`No access token in response: ${bodyText}`);
		}

		return json;
	}
}

export default TokenGeneration;
