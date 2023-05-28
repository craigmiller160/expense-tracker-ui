export type ParamsWrapper = {
	readonly setOrDelete: <T>(
		key: string,
		value: T | null | undefined,
		transform?: (v: T) => string
	) => void;
	readonly getOrDefault: <T>(
		key: string,
		defaultValue: T,
		transform?: (v: string) => T
	) => T;
};

export const wrapParams = (params: URLSearchParams): ParamsWrapper => ({
	setOrDelete: setOrDeleteParam(params),
	getOrDefault: getOrDefaultParam(params)
});

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
		if (typeof defaultValue !== 'string' && !transform) {
			throw new Error(
				'Must provide a transform argument if a non-string default is set'
			);
		}

		const value = params.get(key);
		if (value && transform) {
			return transform(value);
		}

		if (value) {
			return value as T;
		}

		return defaultValue;
	};
