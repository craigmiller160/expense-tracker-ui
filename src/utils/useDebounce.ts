/* eslint-disable @typescript-eslint/no-explicit-any */
import debounce from 'lodash.debounce';
import { useCallback } from 'react';

type Fn<T> = (...args: any) => T;

export const useDebounce = <T>(fn: Fn<T>, millis: number): Fn<T | undefined> =>
	useCallback((...args: any) => debounce(fn, millis)(args), [fn, millis]);
