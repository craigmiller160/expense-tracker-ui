import { needsAttentionPage } from './testutils/pages/needsAttention';
import { needsAttentionApi } from './testutils/apis/needsAttention';
import { transactionsApi } from './testutils/apis/transactions';
import { categoriesApi } from './testutils/apis/categories';
import { mountApp } from './testutils/mountApp';

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
	const hasDuplicates = getOrDefault(config?.hasDuplicates);
	const hasPossibleRefunds = getOrDefault(config?.hasPossibleRefunds);
	const hasUnconfirmed = getOrDefault(config?.hasUnconfirmed);
	const hasUncategorized = getOrDefault(config?.hasUncategorized);

	if (
		!hasDuplicates &&
		!hasPossibleRefunds &&
		!hasUnconfirmed &&
		!hasUncategorized
	) {
		needsAttentionPage.getNeedsAttentionTitle().should('not.exist');
	}

	if (hasDuplicates) {
		needsAttentionPage
			.getDuplicatesItem()
			.contains('Duplicate - Count: 2, Oldest: 08/11/2022');
	} else {
		needsAttentionPage.getDuplicatesItem().should('not.exist');
	}

	if (hasPossibleRefunds) {
		needsAttentionPage
			.getDuplicatesItem()
			.contains('Possible Refund - Count: 2, Oldest: 10/07/2022');
	} else {
		needsAttentionPage.getDuplicatesItem().should('not.exist');
	}

	if (hasUnconfirmed) {
		needsAttentionPage
			.getUnconfirmedItem()
			.contains('Unconfirmed - Count: 78, Oldest: 08/25/2022');
	} else {
		needsAttentionPage.getUnconfirmedItem().should('not.exist');
	}

	if (hasUncategorized) {
		needsAttentionPage
			.getUncategorizedItem()
			.contains('Uncategorized - Count: 78, Oldest: 08/25/2022');
	} else {
		needsAttentionPage.getUncategorizedItem().should('not.exist');
	}
};

describe('Needs Attention', () => {
	describe('Transactions Page', () => {
		it('has duplicates', () => {
			transactionsApi.searchForTransactions();
			categoriesApi.getAllCategories();
			needsAttentionApi.getNeedsAttention_duplicates();
			mountApp({
				initialRoute: '/expense-tracker/transactions'
			});
			validateNeedsAttention({
				hasDuplicates: true
			});
		});

		it('has possible refunds', () => {
			transactionsApi.searchForTransactions();
			categoriesApi.getAllCategories();
			needsAttentionApi.getNeedsAttention_possibleRefund();
			mountApp({
				initialRoute: '/expense-tracker/transactions'
			});
			validateNeedsAttention({
				hasPossibleRefunds: true
			});
		});

		it('has unconfirmed', () => {
			transactionsApi.searchForTransactions();
			categoriesApi.getAllCategories();
			needsAttentionApi.getNeedsAttention_unconfirmed();
			mountApp({
				initialRoute: '/expense-tracker/transactions'
			});
			validateNeedsAttention({
				hasUnconfirmed: true
			});
		});

		it('has uncategorized', () => {
			transactionsApi.searchForTransactions();
			categoriesApi.getAllCategories();
			needsAttentionApi.getNeedsAttention_uncategorized();
			mountApp({
				initialRoute: '/expense-tracker/transactions'
			});
			validateNeedsAttention({
				hasUncategorized: true
			});
		});

		it('has all', () => {
			transactionsApi.searchForTransactions();
			categoriesApi.getAllCategories();
			needsAttentionApi.getNeedsAttention_all();
			mountApp({
				initialRoute: '/expense-tracker/transactions'
			});
			validateNeedsAttention({
				hasUncategorized: true,
				hasUnconfirmed: true,
				hasPossibleRefunds: true,
				hasDuplicates: true
			});
		});

		it('has none', () => {
			transactionsApi.searchForTransactions();
			categoriesApi.getAllCategories();
			needsAttentionApi.getNeedsAttention_none();
			mountApp({
				initialRoute: '/expense-tracker/transactions'
			});
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
