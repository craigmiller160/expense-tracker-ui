export type TransactionToUpdate = {
	readonly transactionId: string;
	readonly confirmed: boolean;
	readonly categoryId?: string;
};

export type UpdateTransactionsRequest = {
	readonly transactions: ReadonlyArray<TransactionToUpdate>;
};

export type UpdateTransactionDetailsRequest = {
	readonly transactionId: string;
	readonly confirmed: boolean;
	readonly expenseDate: string;
	readonly description: string;
	readonly amount: number;
	readonly categoryId?: string;
};

export type ConfirmTransactionsRequest = {
	readonly transactionsToConfirm: ReadonlyArray<TransactionToConfirm>;
};

export type TransactionToConfirm = {
	readonly transactionId: string;
	readonly confirmed: boolean;
};

export type CategorizeTransactionsRequest = {
	readonly transactionsAndCategories: ReadonlyArray<TransactionAndCategory>;
};

export type TransactionAndCategory = {
	readonly transactionId: string;
	readonly categoryId?: string;
};

export type CategoryRequest = {
	readonly name: string;
};

export type CreateTransactionRequest = {
	readonly expenseDate: string;
	readonly description: string;
	readonly amount: number;
	readonly categoryId?: string;
};

export type TransactionResponse = {
	readonly id: string;
	readonly expenseDate: string;
	readonly description: string;
	readonly amount: number;
	readonly confirmed: boolean;
	readonly duplicate: boolean;
	readonly categoryId?: string;
	readonly categoryName?: string;
};

export type ImportTransactionsResponse = {
	readonly transactionsImported: number;
};

export type AuthCodeLoginDto = {
	readonly url: string;
};

export type CategoryResponse = {
	readonly id: string;
	readonly name: string;
	readonly color: string;
};

export type SearchTransactionsRequest = {
	readonly pageNumber: number;
	readonly pageSize: number;
	readonly sortKey: 'EXPENSE_DATE';
	readonly sortDirection: 'ASC' | 'DESC';
	readonly startDate?: string;
	readonly endDate?: string;
	readonly isConfirmed?: boolean;
	readonly isCategorized?: boolean;
	readonly isDuplicate?: boolean;
	readonly isPossibleRefund?: boolean;
	readonly categoryIds?: ReadonlyArray<string>;
};

export type TransactionsPageResponse = {
	readonly transactions: ReadonlyArray<TransactionResponse>;
	readonly pageNumber: number;
	readonly totalItems: number;
};

export type GetPossibleDuplicatesRequest = {
	readonly pageNumber: number;
	readonly pageSize: number;
};

export type TransactionDuplicatePageResponse = {
	readonly transactions: ReadonlyArray<TransactionDuplicateResponse>;
	readonly pageNumber: number;
	readonly totalItems: number;
};

export type TransactionDuplicateResponse = {
	readonly id: string;
	readonly confirmed: boolean;
	readonly created: string;
	readonly updated: string;
	readonly categoryName?: string;
};

export type TransactionDetailsResponse = {
	readonly id: string;
	readonly expenseDate: string;
	readonly description: string;
	readonly amount: number;
	readonly confirmed: boolean;
	readonly duplicate: boolean;
	readonly categoryId?: string;
	readonly categoryName?: string;
	readonly created: string;
	readonly updated: string;
};

export type CountAndOldest = {
	readonly count: number;
	readonly oldest?: string;
};

export type NeedsAttentionResponse = {
	readonly unconfirmed: CountAndOldest;
	readonly uncategorized: CountAndOldest;
	readonly duplicate: CountAndOldest;
	readonly possibleRefund: CountAndOldest;
};

export type ImportTypeResponse = {
	readonly key: string;
	readonly displayName: string;
};

export type ReportRequest = {
	readonly pageNumber: number;
	readonly pageSize: number;
};

export type ReportCategoryResponse = {
	readonly name: string;
	readonly color: string;
	readonly amount: number;
	readonly percent: number;
};

export type ReportMonthResponse = {
	readonly date: string;
	readonly total: number;
	readonly categories: ReadonlyArray<ReportCategoryResponse>;
};

export type ReportPageResponse = {
	readonly reports: ReadonlyArray<ReportMonthResponse>;
	readonly pageNumber: number;
	readonly totalItems: number;
};

export type AuthUserDto = {
	readonly userId: number;
	readonly username: string;
	readonly roles: ReadonlyArray<string>;
	readonly firstName: string;
	readonly lastName: string;
};

export type DeleteTransactionsRequest = {
	readonly ids: ReadonlyArray<string>;
};
