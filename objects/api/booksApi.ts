import TokenGeneration from "./tokenGeneration";

class BooksApi extends TokenGeneration {
  constructor(apiRequestContext) {
    super(apiRequestContext);
  }

  async getBooks() {
    //OPTMIZE token and access token not to be created in each method
    const tokenResponse = await this.generateToken();
    const accessToken = tokenResponse.access_token;

    const url = process.env.GET_BOOKS_URL;

    const res = await this.apiRequestContext.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apiKey: process.env.API_KEY,
      },
    });

    return await res.json();
  }

  async deleteBooks() {
    const tokenResponse = await this.generateToken();
    const accessToken = tokenResponse.access_token;

    const books = await this.getBooks();

    const ids = books
      .map((b) => b.id)
      .filter((id): id is string => typeof id === "string" && id.length > 0);

    for (const id of ids) {
      const deleteUrl = `https://shydksffesvxfmlmnpfi.supabase.co/rest/v1/books?id=eq.${encodeURIComponent(
        id
      )}`;
      await this.apiRequestContext.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apiKey: process.env.API_KEY,
        },
      });
      console.log(`Book deleted with id: ${id}`);
    }
  }

  async addBook(author: string, title: string) {
    const tokenResponse = await this.generateToken();
    const accessToken = tokenResponse.access_token;

    const postUrl = "https://shydksffesvxfmlmnpfi.supabase.co/rest/v1/books";
    await this.apiRequestContext.post(postUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apiKey: process.env.API_KEY,
      },
      data: {
        author: author,
        person_id: null,
        title: title,
        user_id: process.env.USER_ID,
      },
    });
  }
}
export default BooksApi;
