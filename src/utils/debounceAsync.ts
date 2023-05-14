/* eslint-disable @typescript-eslint/no-explicit-any */

type AsyncFunction<T> = (...args: any[]) => Promise<T>;

type RealTimeout = ReturnType<typeof setTimeout>;

export const debounceAsync = <T>(fn: AsyncFunction<T>, millis: number) => {
	let timeoutId: RealTimeout;

	return (...args: any[]) => {
		clearTimeout(timeoutId);

		return new Promise((resolve, reject) => {
			timeoutId = setTimeout(() => {
				fn(...args)
					.then(resolve)
					.catch(reject);
			}, millis);
		});
	};
};
