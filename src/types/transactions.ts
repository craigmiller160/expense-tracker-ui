export type SearchTransactionsRequest = {
	readonly pageNumber: number;
	readonly pageSize: number;
	readonly sortKey: 'EXPENSE_DATE';
	readonly sortDirection: 'ASC' | 'DESC';
	readonly startDate?: string;
	readonly endDate?: string;
	readonly confirmed: 'ALL' | 'YES' | 'NO';
	readonly categorized: 'ALL' | 'YES' | 'NO';
	readonly duplicate: 'ALL' | 'YES' | 'NO';
	readonly possibleRefund: 'ALL' | 'YES' | 'NO';
	readonly categoryIds?: ReadonlyArray<string>;
	readonly description?: string;
};

export type EnhancedSearchTransactionsRequest = Omit<
	SearchTransactionsRequest,
	'startDate' | 'endDate'
> & {
	readonly startDate: Date | null;
	readonly endDate: Date | null;
};
