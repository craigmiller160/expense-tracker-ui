import type { Request } from 'miragejs';

export const getQueryParamFromRequest =
	(request: Request) =>
	(key: string): string | undefined => {
		const param = request.queryParams[key];
		if (param instanceof Array) {
			return param[0];
		}
		return param ?? undefined;
	};
