export const formatCurrency = (amount: number): string => {
	const isNegative = amount < 0;
	return `${isNegative ? '-' : ''}$${Math.abs(amount).toLocaleString('en', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	})}`;
};

export const formatPercent = (amount: number): string =>
	(amount * 100).toLocaleString('en', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
