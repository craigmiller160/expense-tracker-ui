export const setOrDeleteParam =
	(params: URLSearchParams) =>
	(key: string, value: string | null | undefined) => {
		if (value) {
			params.set(key, value);
		} else {
			params.delete(key);
		}
	};
