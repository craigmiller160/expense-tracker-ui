import * as RNonEmptyArray from 'fp-ts/ReadonlyNonEmptyArray';
import { pipe } from 'fp-ts/function';
import type { OrdinalOption } from '../types/rules';
import { useMemo } from 'react';

export const getTrueMaxOrdinal = (
	maxOrdinal: number,
	isNewRule: boolean
): number => (isNewRule ? maxOrdinal + 1 : maxOrdinal);

export const useCreateOrdinalOptions = (
	maxOrdinal: number,
	isNewRule: boolean
): ReadonlyArray<OrdinalOption> => {
	const rangeEnd = getTrueMaxOrdinal(maxOrdinal, isNewRule);
	return useMemo(
		() =>
			pipe(
				RNonEmptyArray.range(1, rangeEnd),
				RNonEmptyArray.map(
					(ordinal): OrdinalOption => ({
						value: ordinal,
						label: `${ordinal}`
					})
				)
			),
		[rangeEnd]
	);
};
