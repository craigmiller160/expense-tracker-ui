import { formatAmountValue } from '../../../../src/components/Content/Transactions/utils';

describe('Transaction utils', () => {
	describe('formatAmountValue', () => {
		it('100', () => {
			const result = formatAmountValue('100');
			expect(result).toEqual('100.00');
		});
		it('100.00', () => {
			const result = formatAmountValue('100.00');
			expect(result).toEqual('100.00');
		});
		it('100.0000', () => {
			const result = formatAmountValue('100.0000');
			expect(result).toEqual('100.00');
		});
		it('100.0', () => {
			const result = formatAmountValue('100.0');
			expect(result).toEqual('100.00');
		});
		it('100.00.00', () => {
			const result = formatAmountValue('100.00.00');
			expect(result).toEqual('100.00');
		});

		it('100abc', () => {
			const result = formatAmountValue('100abc');
			expect(result).toEqual('100.00');
		});
	});
});
