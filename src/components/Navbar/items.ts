export interface NavbarItem {
	readonly to: string;
	readonly label: string;
}

export const NAVBAR_ITEMS: ReadonlyArray<NavbarItem> = [
	{
		to: '/expense-tracker/transactions',
		label: 'Manage Transactions'
	},
	{
		to: '/expense-tracker/categories',
		label: 'Manage Categories'
	},
	{
		to: '/expense-tracker/import',
		label: 'Import Transactions'
	}
];
