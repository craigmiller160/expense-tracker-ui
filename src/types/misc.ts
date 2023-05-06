export enum SortDirection {
	ASC = 'ASC',
	DESC = 'DESC'
}

export const isSortDirection = (
	value: string | null | undefined
): value is SortDirection =>
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	Object.values(SortDirection).includes(value);

export enum TransactionSortKey {
	EXPENSE_DATE = 'EXPENSE_DATE'
}
