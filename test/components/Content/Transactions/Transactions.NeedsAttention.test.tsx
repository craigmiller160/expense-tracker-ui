import { apiServer } from '../../../server';
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
import * as Sleep from '@craigmiller160/ts-functions/es/Sleep';

const oldestDate = pipe(new Date(), Time.subDays(100));
const oldestDateResponseFormat = Time.format(DATE_FORMAT)(oldestDate);
const oldestDateDisplayFormat = Time.format('MM/dd/yyyy')(oldestDate);

interface Flags {
	readonly notConfirmed: boolean;
	readonly duplicate: boolean;
	readonly notCategorized: boolean;
	readonly possibleRefund: boolean;
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
						amount:
							flags?.possibleRefund ?? false
								? 10 + index
								: (10 + index) * -1,
						confirmed: !(flags?.notConfirmed ?? false),
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
	let prepareData: PrepareData;
	beforeEach(() => {
		prepareData = createPrepareData(apiServer.database);
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

	it('has possible refunds', async () => {
		throw new Error();
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
		prepareData({
			duplicate: true,
			notCategorized: true,
			notConfirmed: true
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
			expect(
				screen.queryByText('Transactions Need Attention')
			).toBeVisible()
		);
		const needsAttentionNotice = screen.getByTestId(
			'needs-attention-notice'
		);
		expect(
			within(needsAttentionNotice).queryByText(/.*Uncategorized.*/)
		).toHaveTextContent(
			`Uncategorized - Count: 3, Oldest: ${oldestDateDisplayFormat}`
		);
		expect(
			within(needsAttentionNotice).queryByText(/.*Unconfirmed.*/)
		).toHaveTextContent(
			`Unconfirmed - Count: 3, Oldest: ${oldestDateDisplayFormat}`
		);
		expect(
			within(needsAttentionNotice).getByText(/.*Duplicates.*/)
		).toHaveTextContent(
			`Duplicates - Count: 3, Oldest: ${oldestDateDisplayFormat}`
		);
	});

	it('has none', async () => {
		prepareData();
		await renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Transactions')).toHaveLength(2)
		);
		await Sleep.sleep(200)();

		expect(
			screen.queryByText('Transactions Need Attention')
		).not.toBeInTheDocument();
	});
});
