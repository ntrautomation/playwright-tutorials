import TokenGeneration from "./tokenGeneration";

interface Book {
	id: string;
	[key: string]: any;
}

class BooksApi extends TokenGeneration {
	constructor(apiRequestContext: any) {
		super(apiRequestContext);

		if (!this.baseUrl || !this.booksEndpoint || !this.apiKey) {
			throw new Error("Missing required environment variables");
		}
	}

	private accessToken?: string;

	private baseUrl = process.env.SUPABASE_BASE_URL ?? "";
	private booksEndpoint = process.env.BOOKS_ENDPOINT ?? "";
	private apiKey = process.env.API_KEY ?? "";

	private async getAccessToken(): Promise<string> {
		if (!this.accessToken) {
			const tokenResponse = await this.generateToken();
			this.accessToken = tokenResponse.access_token;
		}
		return this.accessToken;
	}

	private async getHeaders() {
		const token = await this.getAccessToken();

		return {
			Authorization: `Bearer ${token}`,
			apiKey: this.apiKey,
		};
	}

	async getBooks(): Promise<Book[]> {
		const res = await this.apiRequestContext.get(
			`${this.baseUrl}${this.booksEndpoint}`,
			{
				headers: await this.getHeaders(),
			}
		);

		if (!res.ok()) {
			throw new Error(
				`Failed to fetch books: ${res.status()} ${res.statusText()}`
			);
		}

		return await res.json();
	}

	async deleteBooks(): Promise<void> {
		const books = await this.getBooks();

		const ids = books
			.map((b) => b.id)
			.filter((id): id is string => typeof id === "string" && id.length > 0);

		for (const id of ids) {
			const deleteUrl = `${this.baseUrl}${this.booksEndpoint}?id=eq.${encodeURIComponent(id)}`;

			const res = await this.apiRequestContext.delete(deleteUrl, {
				headers: await this.getHeaders(),
			});

			if (!res.ok()) {
				throw new Error(`Failed to delete book ${id}: ${res.status()}`);
			}

			console.log(`Book deleted with id: ${id}`);
		}
	}
}

export default BooksApi;
