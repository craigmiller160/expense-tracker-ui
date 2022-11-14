type NeedsAttentionValidationConfig = {
	readonly hasDuplicates: boolean;
	readonly hasPossibleRefunds: boolean;
	readonly hasUnconfirmed: boolean;
	readonly hasUncategorized: boolean;
};

const getOrDefault = (value?: boolean): boolean => value ?? false;

const validateNeedsAttention = (
	config?: Partial<NeedsAttentionValidationConfig>
) => {
	throw new Error();
};

describe('Needs Attention', () => {
	describe('Transactions Page', () => {
		it('has duplicates', () => {
			validateNeedsAttention({
				hasDuplicates: true
			});
		});

		it('has possible refunds', () => {
			validateNeedsAttention({
				hasPossibleRefunds: true
			});
		});

		it('has unconfirmed', () => {
			validateNeedsAttention({
				hasUnconfirmed: true
			});
		});

		it('has uncategorized', () => {
			validateNeedsAttention({
				hasUncategorized: true
			});
		});

		it('has all', () => {
			validateNeedsAttention({
				hasUncategorized: true,
				hasUnconfirmed: true,
				hasPossibleRefunds: true,
				hasDuplicates: true
			});
		});

		it('has none', () => {
			validateNeedsAttention();
		});
	});

	describe('Reports Page', () => {
		it('has duplicates', () => {
			validateNeedsAttention({
				hasDuplicates: true
			});
		});

		it('has possible refunds', () => {
			validateNeedsAttention({
				hasPossibleRefunds: true
			});
		});

		it('has unconfirmed', () => {
			validateNeedsAttention({
				hasUnconfirmed: true
			});
		});

		it('has uncategorized', () => {
			validateNeedsAttention({
				hasUncategorized: true
			});
		});

		it('has all', () => {
			validateNeedsAttention({
				hasUncategorized: true,
				hasUnconfirmed: true,
				hasPossibleRefunds: true,
				hasDuplicates: true
			});
		});

		it('has none', () => {
			validateNeedsAttention();
		});
	});
});
