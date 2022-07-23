export const formatCurrency = (amount: number): string => {
	const isNegative = amount < 0;
	return `${isNegative ? '-' : ''}$${Math.abs(amount).toLocaleString('en', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	})}`;
};
