export class NoAlertError extends Error {
	name = 'NoAlertError';
	cause: Error | undefined = undefined;
	constructor(msg: string, options?: { cause?: Error }) {
		super(msg);
		this.cause = options?.cause;
	}
}
