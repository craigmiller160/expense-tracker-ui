import { Component, lazy } from 'solid-js';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const namedLazy = (
	importer: () => Promise<Record<string, any>>,
	name: string
) =>
	lazy(() =>
		importer().then((res) => ({
			default: res[name] as Component<any>
		}))
	);
/* eslint-enable @typescript-eslint/no-explicit-any */
