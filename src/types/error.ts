export interface ErrorResponse {
	readonly timestamp: string;
	readonly method: string;
	readonly path: string;
	readonly status: number;
	readonly message: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isErrorResponse = (value: any): value is ErrorResponse =>
	!!value.timestamp &&
	!!value.method &&
	!!value.path &&
	!!value.status &&
	!!value.message;
