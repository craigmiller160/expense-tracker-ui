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
	onSubmit: jest.fn(),
	isFetching: false,
	openDetailsDialog: jest.fn(),
	resetFormToData: jest.fn(),
	pagination: {
		totalRecords: 0,
		pageSize: 0,
		currentPage: 0
	},
	onPaginationChange: jest.fn()
};

describe('TransactionTable arePropsEqual', () => {
	it('everything is equal', () => {
		expect(arePropsEqual(props, props)).toEqual(true);
	});

	it('function has changed, everything else is equal', () => {
		throw new Error();
	});

	it('primitive value has changed', () => {
		throw new Error();
	});

	it('object reference has changed', () => {
		throw new Error();
	});
});
