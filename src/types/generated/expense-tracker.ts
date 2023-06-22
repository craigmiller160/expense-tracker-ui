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

export type AutoCategorizeRuleRequest = {
	readonly categoryId: string;
	readonly regex: string;
	readonly ordinal?: number;
	readonly startDate?: string;
	readonly endDate?: string;
	readonly minAmount?: number;
	readonly maxAmount?: number;
};

export type AutoCategorizeRuleResponse = {
	readonly id: string;
	readonly categoryId: string;
	readonly categoryName: string;
	readonly ordinal: number;
	readonly regex: string;
	readonly startDate?: string;
	readonly endDate?: string;
	readonly minAmount?: number;
	readonly maxAmount?: number;
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
	readonly confirmed: 'ALL' | 'YES' | 'NO';
	readonly categorized: 'ALL' | 'YES' | 'NO';
	readonly duplicate: 'ALL' | 'YES' | 'NO';
	readonly possibleRefund: 'ALL' | 'YES' | 'NO';
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

export type LastRuleAppliedResponse = {
	readonly id: string;
	readonly ruleId: string;
	readonly transactionId: string;
	readonly categoryId: string;
	readonly categoryName: string;
	readonly ordinal: number;
	readonly regex: string;
	readonly startDate?: string;
	readonly endDate?: string;
	readonly minAmount?: number;
	readonly maxAmount?: number;
};

export type ImportTypeResponse = {
	readonly key: string;
	readonly displayName: string;
};

export type ReportRequest = {
	readonly pageNumber: number;
	readonly pageSize: number;
	readonly categoryIdType: 'INCLUDE' | 'EXCLUDE';
	readonly categoryIds: ReadonlyArray<string>;
};

export type ReportCategoryResponse = {
	readonly id: string;
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

export type AutoCategorizeRulePageRequest = {
	readonly pageNumber: number;
	readonly pageSize: number;
	readonly categoryId?: string;
	readonly regex?: string;
};

export type AutoCategorizeRulePageResponse = {
	readonly rules: ReadonlyArray<AutoCategorizeRuleResponse>;
	readonly pageNumber: number;
	readonly totalItems: number;
};

export type MaxOrdinalResponse = {
	readonly maxOrdinal: number;
};

export type DeleteTransactionsRequest = {
	readonly ids: ReadonlyArray<string>;
};

export type DeleteTransactionsResponse = {
	readonly transactionsDeleted: number;
};
