import { identity, pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';

export const formatAmountValue = (value: string): string => {
	if (value.length === 0) {
		return '';
	}
	const numericValue = value.replace(/[a-zA-z]/g, '');
	const parts = numericValue.split('.');
	const decimal = pipe(
		Option.fromNullable(parts[1]),
		Option.map((decimal) => decimal.padEnd(2, '0').substring(0, 2)),
		Option.fold(() => '00', identity)
	);
	return `${parts[0]}.${decimal}`;
};
