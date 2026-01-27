import { APIRequestContext } from "@playwright/test";

class BaseAPI {
    apiRequestContext: APIRequestContext;

    constructor(apiRequestContext: APIRequestContext) {
        this.apiRequestContext = apiRequestContext;
    }
}export default BaseAPI;