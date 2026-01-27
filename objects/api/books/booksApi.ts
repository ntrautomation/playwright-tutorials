import TokenGeneration from "../token/tokenGeneration";

class BooksApi extends TokenGeneration {
    constructor( apiRequestContext ) {
        super(apiRequestContext);
    }

    async getBooks() {
        const tokenResponse =  await this.generateToken();
        const accessToken = tokenResponse.access_token;

        const url = "https://shydksffesvxfmlmnpfi.supabase.co/rest/v1/books?select=*";

        const res = await this.apiRequestContext.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoeWRrc2ZmZXN2eGZtbG1ucGZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNDA3MjcsImV4cCI6MjA3OTYxNjcyN30.966b_r05IO70vRQw7qUC8wdu1uivlPkp_oVkOe_6kp4",
            },
        });

        return await res.json();
    }

    async deleteAllBooks() {
        const tokenResponse =  await this.generateToken();
        const accessToken = tokenResponse.access_token;

        const books = await this.getBooks();
        const ids = books
            .map(b => b.id)
            .filter((id): id is string => typeof id === "string" && id.length > 0);

        for (const id of ids) {
            const url = `https://shydksffesvxfmlmnpfi.supabase.co/rest/v1/books?id=eq.${encodeURIComponent(id)}`;

            await this.apiRequestContext.delete(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoeWRrc2ZmZXN2eGZtbG1ucGZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNDA3MjcsImV4cCI6MjA3OTYxNjcyN30.966b_r05IO70vRQw7qUC8wdu1uivlPkp_oVkOe_6kp4",
                },
            });
            console.log(id);
        }
    }
}
export default BooksApi;