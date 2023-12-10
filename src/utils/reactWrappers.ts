import type { ComponentType } from 'react';
import { lazy } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const namedLazy = (
	importer: () => Promise<Record<string, any>>,
	name: string
) =>
	lazy(() =>
		importer().then((res) => ({
			default: res[name] as ComponentType<any>
		}))
	);
/* eslint-enable @typescript-eslint/no-explicit-any */
