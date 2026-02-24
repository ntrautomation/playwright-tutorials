/**
 * Generates a unique run ID to prefix book titles in spec files.
 * Each spec file should declare `const RUN_ID = generateRunId()` at the top
 * and use it as a title prefix: `${RUN_ID}-${faker.word.words(3)}`.
 * Cleanup then uses `booksApi.deleteBooksWithPrefix(RUN_ID)` instead of
 * `deleteBooks()` so parallel workers never clobber each other's data.
 */
export function generateRunId(): string {
	return `run-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
