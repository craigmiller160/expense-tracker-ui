import { ApiServer, newApiServer } from '../../../server';
import { renderApp } from '../../../testutils/renderApp';
import { screen, waitFor, within } from '@testing-library/react';
import { Database } from '../../../server/Database';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { pipe } from 'fp-ts/es6/function';
import { DATE_FORMAT } from '../../../../src/types/transactions';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import * as RNonEmptyArray from 'fp-ts/es6/ReadonlyNonEmptyArray';
import * as Monoid from 'fp-ts/es6/Monoid';
import {
	createTransaction,
	transactionRecordMonoid,
	transactionToRecord
} from '../../../testutils/transactionDataUtils';
import '@testing-library/jest-dom';

const oldestDate = pipe(new Date(), Time.subDays(100));
const oldestDateResponseFormat = Time.format(DATE_FORMAT)(oldestDate);
const oldestDateDisplayFormat = Time.format('MM/dd/yyyy')(oldestDate);

interface Flags {
	readonly notConfirmed: boolean;
	readonly duplicate: boolean;
	readonly notCategorized: boolean;
}
type PrepareData = (flags?: Partial<Flags>) => void;

const createPrepareData =
	(database: Database): PrepareData =>
	(flags) => {
		database.updateData((draft) => {
			const firstCategory = Object.values(draft.categories)[0];
			const baseTransactions = pipe(
				Object.values(draft.transactions),
				RArray.map((transaction) =>
					createTransaction({
						...transaction,
						confirmed: true,
						duplicate: false,
						categoryId: firstCategory.id,
						categoryName: firstCategory.name
					})
				),
				RArray.map(transactionToRecord),
				Monoid.concatAll(transactionRecordMonoid)
			);
			const newTransactions = pipe(
				RNonEmptyArray.range(0, 2),
				RArray.map((index) =>
					createTransaction({
						amount: 10 + index,
						confirmed: flags?.notConfirmed ?? true,
						duplicate: flags?.duplicate ?? false,
						categoryId:
							flags?.notCategorized ?? false
								? undefined
								: firstCategory.id,
						categoryName:
							flags?.notCategorized ?? false
								? undefined
								: firstCategory.name,
						expenseDate: oldestDateResponseFormat
					})
				),
				RArray.map(transactionToRecord),
				Monoid.concatAll(transactionRecordMonoid)
			);
			draft.transactions = {
				...baseTransactions,
				...newTransactions
			};
		});
	};

describe('Transactions Needs Attention', () => {
	let apiServer: ApiServer;
	let prepareData: PrepareData;
	beforeEach(() => {
		apiServer = newApiServer();
		prepareData = createPrepareData(apiServer.database);
	});

	afterEach(() => {
		apiServer.server.shutdown();
	});

	it('has duplicates', async () => {
		prepareData({ duplicate: true });
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
			expect(
				screen.queryByText('Transactions Need Attention')
			).toBeVisible()
		);
		const needsAttentionNotice = screen.getByTestId(
			'needs-attention-notice'
		);
		expect(
			within(needsAttentionNotice).queryByText(/.*Uncategorized.*/)
		).not.toBeInTheDocument();
		expect(
			within(needsAttentionNotice).queryByText(/.*Unconfirmed.*/)
		).not.toBeInTheDocument();
		expect(
			within(needsAttentionNotice).getByText(/.*Duplicates.*/)
		).toHaveTextContent(
			`Duplicates - Count: 3, Oldest: ${oldestDateDisplayFormat}`
		);
	});

	it('has unconfirmed', async () => {
		prepareData({ notConfirmed: true });
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
			expect(
				screen.queryByText('Transactions Need Attention')
			).toBeVisible()
		);
		const needsAttentionNotice = screen.getByTestId(
			'needs-attention-notice'
		);
		expect(
			within(needsAttentionNotice).queryByText(/.*Uncategorized.*/)
		).not.toBeInTheDocument();
		expect(
			within(needsAttentionNotice).queryByText(/.*Duplicates.*/)
		).not.toBeInTheDocument();
		expect(
			within(needsAttentionNotice).getByText(/.*Unconfirmed.*/)
		).toHaveTextContent(
			`Unconfirmed - Count: 3, Oldest: ${oldestDateDisplayFormat}`
		);
	});

	it('has uncategorized', async () => {
		prepareData({ notCategorized: true });
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
			expect(
				screen.queryByText('Transactions Need Attention')
			).toBeVisible()
		);
		const needsAttentionNotice = screen.getByTestId(
			'needs-attention-notice'
		);
		expect(
			within(needsAttentionNotice).queryByText(/.*Unconfirmed.*/)
		).not.toBeInTheDocument();
		expect(
			within(needsAttentionNotice).queryByText(/.*Duplicates.*/)
		).not.toBeInTheDocument();
		expect(
			within(needsAttentionNotice).getByText(/.*Uncategorized.*/)
		).toHaveTextContent(
			`Uncategorized - Count: 3, Oldest: ${oldestDateDisplayFormat}`
		);
	});

	it('has all', async () => {
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
			expect(
				screen.queryByText('Transactions Need Attention')
			).toBeVisible()
		);
		throw new Error();
	});

	it('has none', async () => {
		await renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Transactions')).toHaveLength(2)
		);
		throw new Error();
	});
});
