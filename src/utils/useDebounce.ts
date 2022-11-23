import debounce from 'lodash.debounce';
import { useMemo } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fn<T> = (...args: any) => T;

export const useDebounce = <T>(fn: Fn<T>, millis: number): Fn<T | undefined> =>
	useMemo(() => debounce(fn, millis), [fn, millis]);
