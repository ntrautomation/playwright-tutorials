import { APIRequestContext } from "@playwright/test";

class BaseApi {
	apiRequestContext: APIRequestContext;

	constructor(apiRequestContext: APIRequestContext) {
		this.apiRequestContext = apiRequestContext;
	}
}
export default BaseApi;
