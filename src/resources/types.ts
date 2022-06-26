import { ResourceReturn } from 'solid-js';
import { ResourceOptions } from 'solid-js/types/reactive/signal';

export type DefaultResourceReturn<
	T,
	R = ResourceOptions<undefined>
> = ResourceReturn<T | undefined, R>;
