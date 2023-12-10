export interface ErrorResponse {
	readonly timestamp: string;
	readonly method: string;
	readonly path: string;
	readonly status: number;
	readonly message: string;
}

export const isErrorResponse = (value: unknown): value is ErrorResponse =>
	!!value &&
	typeof value === 'object' &&
	Object.hasOwn(value, 'timestamp') &&
	Object.hasOwn(value, 'method') &&
	Object.hasOwn(value, 'path') &&
	Object.hasOwn(value, 'status') &&
	Object.hasOwn(value, 'message');
