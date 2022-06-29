export class NoAlertOrStatusHandlingError extends Error {
	name = 'NoAlertOrStatusHandlingError';
	cause: Error | undefined = undefined;
	constructor(msg: string, options?: { cause?: Error }) {
		super(msg);
		this.cause = options?.cause;
	}
}
