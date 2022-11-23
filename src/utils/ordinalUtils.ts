import * as RNonEmptyArray from 'fp-ts/es6/ReadonlyNonEmptyArray';
import { pipe } from 'fp-ts/es6/function';
import { OrdinalOption } from '../types/rules';
import { useMemo } from 'react';

export const useCreateOrdinalOptions = (
	maxOrdinal: number,
	isNewRule: boolean
): ReadonlyArray<OrdinalOption> => {
	const rangeEnd = isNewRule ? maxOrdinal + 1 : maxOrdinal;
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
