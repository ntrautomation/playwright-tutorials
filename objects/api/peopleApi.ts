import TokenGeneration from "./tokenGeneration";

class PeopleApi extends TokenGeneration {
	constructor(apiRequestContext) {
		super(apiRequestContext);
	}

	async getPeople() {
		//OPTMIZE token and access token not to be created in each method
		const tokenResponse = await this.generateToken();
		const accessToken = tokenResponse.access_token;

		const url = process.env.GET_PEOPLE_URL;

		const res = await this.apiRequestContext.get(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				apiKey: process.env.API_KEY,
			},
		});

		return await res.json();
	}

	async deletePeople() {
		const tokenResponse = await this.generateToken();
		const accessToken = tokenResponse.access_token;

		const people = await this.getPeople();

		const ids = people.map((p) => p.id).filter((id): id is string => typeof id === "string" && id.length > 0);

		for (const id of ids) {
			const deleteUrl = `https://shydksffesvxfmlmnpfi.supabase.co/rest/v1/persons?id=eq.${encodeURIComponent(id)}`;
			await this.apiRequestContext.delete(deleteUrl, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					apiKey: process.env.API_KEY,
				},
			});
			console.log(`Person deleted with id: ${id}`);
		}
	}
}
export default PeopleApi;
