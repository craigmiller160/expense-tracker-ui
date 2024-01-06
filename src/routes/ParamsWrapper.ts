export type ParamsWrapper<Params> = {
	readonly setOrDelete: <Value>(
		key: keyof Params,
		value: Value | null | undefined,
		transform?: (v: Value) => string
	) => void;
	readonly getOrDefault: <Value>(
		key: keyof Params,
		defaultValue: Value,
		transform?: (v: string) => Value
	) => Value;
};

export const wrapParams = <Params extends object>(
	params: URLSearchParams
): ParamsWrapper<Params> => ({
	setOrDelete: setOrDeleteParam(params),
	getOrDefault: getOrDefaultParam(params)
});

export const setOrDeleteParam =
	(params: URLSearchParams) =>
	<Params extends object, Value>(
		key: keyof Params,
		value: Value | null | undefined,
		transform?: (v: Value) => string
	) => {
		if (value === null || value === undefined) {
			params.delete(key.toString());
			return;
		}

		if (typeof value !== 'string' && !transform) {
			throw new Error(
				'Must provide transform to set non-string value on params'
			);
		}

		if (typeof value !== 'string' && transform) {
			params.set(key.toString(), transform(value));
			return;
		}

		params.set(key.toString(), value.toString());
	};

export const getOrDefaultParam =
	(params: URLSearchParams) =>
	<Params extends object, Value>(
		key: keyof Params,
		defaultValue: Value,
		transform?: (v: string) => Value
	): Value => {
		if (
			defaultValue !== null &&
			defaultValue !== undefined &&
			typeof defaultValue !== 'string' &&
			!transform
		) {
			throw new Error(
				'Must provide a transform argument if a non-string default is set'
			);
		}

		const value = params.get(key.toString());
		if (value && transform) {
			return transform(value);
		}

		if (value) {
			return value as Value;
		}

		return defaultValue;
	};
