export interface NavbarItem {
	readonly to: string;
	readonly label: string;
}

export const MANAGE_TRANSACTIONS_TO = '/expense-tracker/transactions';
export const MANAGE_TRANSACTIONS_LABEL = 'Manage Transactions';
export const MANAGE_CATEGORIES_TO = '/expense-tracker/categories';
export const MANAGE_CATEGORIES_LABEL = 'Manage Categories';
export const IMPORT_TRANSACTIONS_TO = '/expense-tracker/import';
export const IMPORT_TRANSACTIONS_LABEL = 'Import Transactions';

export const NAVBAR_ITEMS: ReadonlyArray<NavbarItem> = [
	{
		to: MANAGE_TRANSACTIONS_TO,
		label: MANAGE_TRANSACTIONS_LABEL
	},
	{
		to: MANAGE_CATEGORIES_TO,
		label: MANAGE_CATEGORIES_LABEL
	},
	{
		to: IMPORT_TRANSACTIONS_TO,
		label: IMPORT_TRANSACTIONS_LABEL
	}
];
