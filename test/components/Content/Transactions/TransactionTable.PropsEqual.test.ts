import type { Props as TransactionTableProps } from '../../../../src/components/Content/Transactions/TransactionTable';
import { arePropsEqual } from '../../../../src/components/Content/Transactions/TransactionTable';

const props: TransactionTableProps = {
	transactions: [],
	categories: [],
	watchedTransactions: [],
	form: {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		formReturn: {},
		fields: []
	},
	onSubmit: vi.fn(),
	isFetching: false,
	openDetailsDialog: vi.fn(),
	resetFormToData: vi.fn(),
	pagination: {
		totalRecords: 0,
		pageSize: 0,
		currentPage: 0
	},
	onPaginationChange: vi.fn()
};

describe('TransactionTable arePropsEqual', () => {
	it('everything is equal', () => {
		expect(arePropsEqual(props, props)).toBe(true);
	});

	it('function has changed, everything else is equal', () => {
		const newProps: TransactionTableProps = {
			...props,
			onPaginationChange: vi.fn()
		};
		expect(props.onPaginationChange).not.toEqual(
			newProps.onPaginationChange
		);
		expect(arePropsEqual(props, newProps)).toBe(true);
	});

	it('primitive value has changed', () => {
		const newProps: TransactionTableProps = {
			...props,
			isFetching: true
		};
		expect(arePropsEqual(props, newProps)).toBe(false);
	});

	it('object reference has changed', () => {
		const newProps: TransactionTableProps = {
			...props,
			pagination: {
				totalRecords: 0,
				pageSize: 0,
				currentPage: 1
			}
		};
		expect(arePropsEqual(props, newProps)).toBe(false);
	});
});
