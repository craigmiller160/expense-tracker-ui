export interface NavbarItem {
	readonly to: string;
	readonly label: string;
}

export const MANAGE_TRANSACTIONS_TO = '/expense-tracker/transactions';
export const MANAGE_TRANSACTIONS_LABEL = 'Transactions';
export const MANAGE_CATEGORIES_TO = '/expense-tracker/categories';
export const MANAGE_CATEGORIES_LABEL = 'Categories';
export const IMPORT_TRANSACTIONS_TO = '/expense-tracker/import';
export const IMPORT_TRANSACTIONS_LABEL = 'Import';
export const REPORTS_TO = '/expense-tracker/reports';
export const REPORTS_LABEL = 'Reports';

export const NAVBAR_ITEMS: ReadonlyArray<NavbarItem> = [
	{
		to: REPORTS_TO,
		label: REPORTS_LABEL
	},
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
