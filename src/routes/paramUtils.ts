// TODO write unit tests for this and make it the actual argument passed to callbacks
export const setOrDeleteParam =
	(params: URLSearchParams) =>
	<T>(
		key: string,
		value: T | null | undefined,
		transform?: (v: T) => string
	) => {
		if (value === null || value === undefined) {
			params.delete(key);
			return;
		}

		if (typeof value !== 'string' && !transform) {
			throw new Error(
				'Must provide transform to set non-string value on params'
			);
		}

		if (typeof value !== 'string' && transform) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			params.set(key, transform(value));
			return;
		}

		params.set(key, value.toString());
	};

export const getOrDefaultParam =
	(params: URLSearchParams) =>
	<T>(key: string, defaultValue: T, transform?: (v: string) => T): T => {

	};
