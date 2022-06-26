import { Component, JSX, lazy } from 'solid-js';

export const namedLazy = (importer: () => Promise<any>, name: string) =>
	lazy(() =>
		importer().then((res) => ({
			default: res[name] as Component<any>
		}))
	);
