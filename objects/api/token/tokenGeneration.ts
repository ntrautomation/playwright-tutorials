import BasePage from "@objects/pages/base.page";
import BaseAPI from "../base.api";

type SupabaseTokenResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    user?: unknown;
};

class TokenGeneration extends BaseAPI {
    constructor(apiRequestContext) {
        super(apiRequestContext);
    }
    async generateToken(): Promise<SupabaseTokenResponse> {
        const url ="https://shydksffesvxfmlmnpfi.supabase.co/auth/v1/token?grant_type=password";

        const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoeWRrc2ZmZXN2eGZtbG1ucGZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNDA3MjcsImV4cCI6MjA3OTYxNjcyN30.966b_r05IO70vRQw7qUC8wdu1uivlPkp_oVkOe_6kp4";
            
        const res = await this.apiRequestContext.post(url, {
            headers: {
                apikey: apiKey,
                "Content-Type": "application/json",
            },
            data: {
                email: "automation@test.com",
                password: "temp123",
            },
        });
        const bodyText = await res.text();

        const json = JSON.parse(bodyText) as SupabaseTokenResponse;

        if (!json.access_token) {
            throw new Error(`No access_token in response: ${bodyText}`);
        }

        return json;
    }
}export default TokenGeneration;