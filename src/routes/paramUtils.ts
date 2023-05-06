export const setOrDeleteParam =
	(params: URLSearchParams) =>
	<T>(
		key: string,
		value: T | null | undefined,
		transform?: (v: T) => string
	) => {
		if (!value) {
			params.delete(key);
		}

		if (typeof value === 'string' && !transform) {
			throw new Error(
				'Must provide transform to set non-string value on params'
			);
		}

		if (typeof value !== 'string' && transform) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			params.set(key, transform(value!));
		}

		params.set(key, value?.toString() ?? '');
	};
