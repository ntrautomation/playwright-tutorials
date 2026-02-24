import TokenGeneration from "./tokenGeneration";
import { APIResponse } from "@playwright/test";

class PeopleApi extends TokenGeneration {
	constructor(apiRequestContext) {
		super(apiRequestContext);
	}

	private getPeopleUrl(): string {
		return process.env.GET_PEOPLE_URL;
	}

	async getPeople(): Promise<any[]> {
		const tokenResponse = await this.generateToken();
		const accessToken = tokenResponse.access_token;

		const res = await this.apiRequestContext.get(this.getPeopleUrl(), {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				apiKey: process.env.API_KEY,
			},
		});

		return await res.json();
	}

	async getPeopleRawResponse(): Promise<APIResponse> {
		const tokenResponse = await this.generateToken();
		const accessToken = tokenResponse.access_token;

		return await this.apiRequestContext.get(this.getPeopleUrl(), {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				apiKey: process.env.API_KEY,
			},
		});
	}
}
export default PeopleApi;
