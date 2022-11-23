import { UseMutationResult } from 'react-query';
import { TaskT } from '@craigmiller160/ts-functions/es/types';

export type UseMutationWithWaitResult<
	TData = unknown,
	TError = unknown,
	TVariables = unknown,
	TContext = unknown
> = UseMutationResult<TData, TError, TVariables, TContext> & {
	waitForSettled: TaskT<void>;
};

type WaitForSettled = {
	readonly onSettled: () => void;
	readonly waitForSettled: TaskT<void>;
};
export const createWaitForSettled = (): WaitForSettled => {
	let resolve: (v?: void) => void;
	const promise = new Promise<void>((r) => {
		resolve = r;
	});
	const onSettled = () => resolve();
	const waitForSettled = () => promise;
	return {
		onSettled,
		waitForSettled
	};
};
