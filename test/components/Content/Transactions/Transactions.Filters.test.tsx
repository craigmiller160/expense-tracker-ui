import { renderApp } from '../../../testutils/renderApp';
import { screen, waitFor, within } from '@testing-library/react';
import {
	ARIA_LABEL_FORMAT,
	getCategoryValueElement,
	getRecordRangeText,
	getTotalDaysInRange,
	selectDate
} from './transactionTestUtils';
import {
	defaultEndDate,
	defaultStartDate
} from '../../../../src/components/Content/Transactions/utils';
import { pipe } from 'fp-ts/es6/function';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import * as Sleep from '@craigmiller160/ts-functions/es/Sleep';
import { searchForTransactions } from '../../../../src/ajaxapi/service/TransactionService';
import {
	DATE_FORMAT,
	TransactionSortKey
} from '../../../../src/types/transactions';
import { SortDirection } from '../../../../src/types/misc';
import { getAllCategories } from '../../../../src/ajaxapi/service/CategoryService';
import userEvent from '@testing-library/user-event';
import { validateTransactionsInTable } from '../../../server/routes/transactions';
import { ApiServer, newApiServer } from '../../../server';
import '@testing-library/jest-dom';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import {
	transactionRecordMonoid,
	transactionToRecord,
	createTransaction
} from '../../../testutils/transactionDataUtils';
import * as Monoid from 'fp-ts/es6/Monoid';

describe('Transactions Filters', () => {
	let apiServer: ApiServer;
	beforeEach(() => {
		apiServer = newApiServer();
	});

	afterEach(() => {
		apiServer.server.shutdown();
	});

	it('start date', async () => {
		await renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Transactions')).toHaveLength(2)
		);
		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);

		const totalDaysInRange = getTotalDaysInRange(
			defaultStartDate(),
			defaultEndDate()
		);

		expect(getRecordRangeText()).toEqual(`1-25 of ${totalDaysInRange}`);

		const dateToSelect = pipe(
			defaultStartDate(),
			Time.subDays(1),
			Time.format(ARIA_LABEL_FORMAT)
		);
		await selectDate('Start Date', dateToSelect);
		await Sleep.immediate();
		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);

		expect(getRecordRangeText()).toEqual(`1-25 of ${totalDaysInRange + 1}`);
	});

	it('end date', async () => {
		await renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Transactions')).toHaveLength(2)
		);
		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);

		const totalDaysInRange = getTotalDaysInRange(
			defaultStartDate(),
			defaultEndDate()
		);

		expect(getRecordRangeText()).toEqual(`1-25 of ${totalDaysInRange}`);

		const dateToSelect = pipe(
			defaultEndDate(),
			Time.subDays(1),
			Time.format(ARIA_LABEL_FORMAT)
		);
		await selectDate('End Date', dateToSelect);
		await Sleep.immediate();
		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);

		expect(getRecordRangeText()).toEqual(`1-25 of ${totalDaysInRange - 1}`);
	});

	it('category', async () => {
		const { transactions } = await searchForTransactions({
			startDate: defaultStartDate(),
			endDate: defaultEndDate(),
			pageNumber: 0,
			pageSize: 25,
			sortKey: TransactionSortKey.EXPENSE_DATE,
			sortDirection: SortDirection.ASC
		});
		const categories = await getAllCategories();
		apiServer.database.updateData((draft) => {
			draft.transactions[transactions[0].id] = createTransaction({
				...transactions[0],
				categoryId: categories[0].id,
				categoryName: categories[0].name
			});
		});
		await renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Transactions')).toHaveLength(2)
		);
		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);

		const filters = screen.getByTestId('transaction-filters');

		await userEvent.click(within(filters).getByLabelText('Category'));
		expect(screen.getAllByText(categories[0].name)).toHaveLength(1);
		await userEvent.click(screen.getByText(categories[0].name));
		await Sleep.immediate();
		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);

		validateTransactionsInTable(1, (index, description) => {
			expect(description.categoryId).toEqual(categories[0].id);
			expect(description.categoryName).toEqual(categories[0].name);
		});
	});

	it('order by', async () => {
		await renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Transactions')).toHaveLength(2)
		);
		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);

		const dates = screen.getAllByTestId('transaction-expense-date');
		expect(dates.length).toEqual(25);

		const expectedFirstDate = pipe(
			defaultStartDate(),
			Time.format(DATE_FORMAT)
		);
		const expectedLastDate = pipe(
			defaultStartDate(),
			Time.addDays(24),
			Time.format(DATE_FORMAT)
		);

		expect(dates[0]).toHaveTextContent(expectedFirstDate);
		expect(dates[24]).toHaveTextContent(expectedLastDate);

		await userEvent.click(screen.getByLabelText('Order By'));
		await userEvent.click(screen.getByText('Newest to Oldest'));
		await Sleep.immediate();
		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);

		const newExpectedFirstDate = pipe(
			defaultEndDate(),
			Time.format(DATE_FORMAT)
		);
		const newExpectedLastDate = pipe(
			defaultEndDate(),
			Time.subDays(24),
			Time.format(DATE_FORMAT)
		);

		const newDates = screen.getAllByTestId('transaction-expense-date');
		expect(newDates.length).toEqual(25);

		expect(newDates[0]).toHaveTextContent(newExpectedFirstDate);
		expect(newDates[24]).toHaveTextContent(newExpectedLastDate);
	});

	it('is duplicate', async () => {
		await renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Transactions')).toHaveLength(2)
		);
		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);
		throw new Error();
	});

	it('is not confirmed', async () => {
		await renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Transactions')).toHaveLength(2)
		);
		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);
		throw new Error();
	});

	it('is not categorized', async () => {
		const { transactions } = await searchForTransactions({
			startDate: defaultStartDate(),
			endDate: defaultEndDate(),
			pageNumber: 0,
			pageSize: 25,
			sortKey: TransactionSortKey.EXPENSE_DATE,
			sortDirection: SortDirection.ASC
		});
		const categories = await getAllCategories();
		apiServer.database.updateData((draft) => {
			draft.transactions = pipe(
				Object.values(draft.transactions),
				RArray.filter(
					(transaction) => transaction.id !== transactions[0].id
				),
				RArray.map((transaction) =>
					createTransaction({
						...transaction,
						categoryId: categories[0].id,
						categoryName: categories[0].name
					})
				),
				RArray.map(transactionToRecord),
				Monoid.concatAll(transactionRecordMonoid)
			);
			draft.transactions[transactions[0].id] = transactions[0];
		});
		await renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Transactions')).toHaveLength(2)
		);
		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);

		validateTransactionsInTable(25, (index, description) => {
			if (index === 0) {
				expect(description.categoryId).toBeUndefined();
				expect(description.categoryName).toBeUndefined();
			} else {
				expect(description.categoryId).toEqual(categories[0].id);
				expect(description.categoryName).toEqual(categories[0].name);
			}
		});

		const filters = screen.getByTestId('transaction-filters');
		await userEvent.click(within(filters).getByLabelText('Category'));
		expect(screen.getAllByText(categories[0].name)).toHaveLength(1);
		await userEvent.click(screen.getByText(categories[0].name));
		await Sleep.immediate();
		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);
		validateTransactionsInTable(25, (index, description) => {
			expect(description.categoryId).toEqual(categories[0].id);
			expect(description.categoryName).toEqual(categories[0].name);
		});

		await userEvent.click(screen.getByLabelText('Is Not Categorized'));
		expect(screen.getByLabelText('Is Not Categorized')).toBeChecked();
		await Sleep.immediate();
		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);
		expect(getCategoryValueElement()).toHaveTextContent('');

		validateTransactionsInTable(1, (index, description) => {
			expect(description.categoryId).toBeUndefined();
			expect(description.categoryName).toBeUndefined();
		});
	});
});
