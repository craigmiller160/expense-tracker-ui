export interface AuthUser {
	readonly userId: number;
	readonly username: string;
	readonly firstName: string;
	readonly lastName: string;
	readonly roles: ReadonlyArray<string>;
}

export interface AuthCodeLogin {
	readonly url: string;
}
