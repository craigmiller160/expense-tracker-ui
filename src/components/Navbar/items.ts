export interface NavbarItem {
	readonly to: string;
	readonly label: string;
}

export const MANAGE_TRANSACTIONS_TO = '/transactions';
export const MANAGE_TRANSACTIONS_LABEL = 'Transactions';
export const MANAGE_CATEGORIES_TO = '/categories';
export const MANAGE_CATEGORIES_LABEL = 'Categories';
export const IMPORT_TRANSACTIONS_TO = '/import';
export const IMPORT_TRANSACTIONS_LABEL = 'Import';
export const REPORTS_TO = '/reports';
export const REPORTS_LABEL = 'Reports';
export const RULES_TO = '/rules';
export const RULES_LABEL = 'Rules';

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
		to: RULES_TO,
		label: RULES_LABEL
	},
	{
		to: IMPORT_TRANSACTIONS_TO,
		label: IMPORT_TRANSACTIONS_LABEL
	}
];
