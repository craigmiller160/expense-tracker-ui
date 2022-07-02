import { PageTitle } from '../../UI/PageTitle';
import './Transactions.scss';
import {
	CategorizeTransactionsMutation,
	useCategorizeTransactions,
	useSearchForTransactions
} from '../../../ajaxapi/query/TransactionQueries';
import {
	SearchTransactionsResponse,
	TransactionAndCategory,
	TransactionResponse,
	TransactionSortKey
} from '../../../types/transactions';
import { SortDirection } from '../../../types/misc';
import { Table, TablePaginationConfig } from '../../UI/Table';
import { Button, TableCell, TableRow } from '@mui/material';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';
import { Updater, useImmer } from 'use-immer';
import { FullPageTableWrapper } from '../../UI/Table/FullPageTableWrapper';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { CategoryResponse } from '../../../types/categories';
import {
	Autocomplete,
	SelectOption
} from '@craigmiller160/react-hook-form-material-ui';
import { useForm, UseFormGetValues, UseFormReset } from 'react-hook-form';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import { useEffect } from 'react';
import { MonoidT } from '@craigmiller160/ts-functions/es/types';
import * as Monoid from 'fp-ts/es6/Monoid';
import * as RNonEmptyArray from 'fp-ts/es6/ReadonlyNonEmptyArray';
import { DEFAULT_ROWS_PER_PAGE, PaginationState } from './utils';

const COLUMNS = ['Expense Date', 'Description', 'Amount', 'Category'];

const toPagination = (
	pageSize: number,
	setState: Updater<PaginationState>,
	data?: SearchTransactionsResponse
): TablePaginationConfig | undefined =>
	pipe(
		Option.fromNullable(data),
		Option.map(
			(values): TablePaginationConfig => ({
				totalRecords: values.totalItems,
				recordsPerPage: pageSize,
				currentPage: parseInt(`${values.pageNumber}`),
				onChangePage: (_, pageNumber) =>
					setState((draft) => {
						draft.pageNumber = pageNumber;
					}),
				onRecordsPerPageChange: (event) =>
					setState((draft) => {
						draft.pageSize = parseInt(event.target.value, 10);
					})
			})
		),
		Option.getOrElse((): TablePaginationConfig | undefined => undefined)
	);

const categoryToSelectOption = (
	category: CategoryResponse
): SelectOption<string> => ({
	label: category.name,
	value: category.id
});

type CategorizationFormData = Record<string, SelectOption<string> | undefined>;

const createOnSetCategorySubmit =
	(
		categorizeTransactionsMutate: CategorizeTransactionsMutation,
		transactions?: ReadonlyArray<TransactionResponse>
	) =>
	(values: CategorizationFormData) => {
		if (!transactions) {
			console.error(
				'Attempted to submit categorization without corresponding transaction data'
			);
			return;
		}

		const transactionsAndCategories = pipe(
			Object.entries(values),
			RArray.mapWithIndex(
				(
					index,
					[, selectedOption]
				): [SelectOption<string> | undefined, number] => [
					selectedOption,
					index
				]
			),
			RArray.filter(([selectedOption]) => selectedOption !== undefined),
			RArray.map(
				([selectedOption, index]): TransactionAndCategory => ({
					transactionId: transactions[index].id,
					categoryId: selectedOption!.value
				})
			)
		);
		categorizeTransactionsMutate({
			transactionsAndCategories
		});
	};

const categorizationFormDataMonoid: MonoidT<CategorizationFormData> = {
	empty: {},
	concat: (data1, data2) => ({
		...data1,
		...data2
	})
};

const setCategoriesFromData = (
	getValues: UseFormGetValues<CategorizationFormData>,
	reset: UseFormReset<CategorizationFormData>,
	transactions?: ReadonlyArray<TransactionResponse>,
	categories?: ReadonlyArray<SelectOption<string>>
) => {
	console.log('SettingData', transactions, categories);
	if (!transactions || !categories) {
		return;
	}
	const values = getValues();
	const newValues = pipe(
		Object.entries(values),
		RArray.mapWithIndex((index, [key]): [string, number, boolean] => [
			key,
			index,
			!!transactions[index].categoryId
		]),
		RArray.filter(([, , hasCategory]) => hasCategory),
		RArray.map(
			([key, index]): CategorizationFormData => ({
				[key]: {
					value: transactions[index].categoryId!,
					label: transactions[index].categoryName!
				}
			})
		),
		Monoid.concatAll(categorizationFormDataMonoid)
	);
	console.log('NewValues', newValues);
	reset({
		...values,
		...newValues
	});
};

const createDefaultValues = (pageSize: number): CategorizationFormData =>
	pipe(
		RNonEmptyArray.range(0, pageSize - 1),
		RNonEmptyArray.map(
			(index): CategorizationFormData => ({
				[`category-${index}`]: undefined
			})
		),
		Monoid.concatAll(categorizationFormDataMonoid)
	);

export const Transactions = () => {
	const [state, setState] = useImmer<PaginationState>({
		pageNumber: 0,
		pageSize: DEFAULT_ROWS_PER_PAGE
	});
	const { data: categoryData, isFetching: categoryIsFetching } =
		useGetAllCategories();
	const { data: transactionData, isFetching: transactionIsFetching } =
		useSearchForTransactions({
			...state,
			sortKey: TransactionSortKey.EXPENSE_DATE,
			sortDirection: SortDirection.ASC
		});
	const { control, handleSubmit, formState, getValues, reset } =
		useForm<CategorizationFormData>({
			defaultValues: createDefaultValues(state.pageSize)
		});
	const { mutate: categorizeTransactionsMutate } =
		useCategorizeTransactions();

	const pagination = toPagination(state.pageSize, setState, transactionData);
	const categoryOptions = categoryData?.map(categoryToSelectOption);

	useEffect(() => {
		setCategoriesFromData(
			getValues,
			reset,
			transactionData?.transactions,
			categoryOptions
		);
	}, [transactionData, categoryOptions]);

	const onSetCategorySubmit = createOnSetCategorySubmit(
		categorizeTransactionsMutate,
		transactionData?.transactions
	);

	const belowTableActions = [
		<Button
			variant="contained"
			color="secondary"
			disabled={!formState.isDirty}
		>
			Cancel
		</Button>,
		<Button
			variant="contained"
			type="submit"
			color="success"
			disabled={!formState.isDirty}
		>
			Save
		</Button>
	];

	return (
		<div className="ManageTransactions">
			<PageTitle title="Manage Transactions" />
			<form onSubmit={handleSubmit(onSetCategorySubmit)}>
				<FullPageTableWrapper data-testid="transaction-table">
					<Table
						columns={COLUMNS}
						loading={transactionIsFetching}
						pagination={pagination}
						belowTableActions={belowTableActions}
					>
						{(transactionData?.transactions ?? []).map(
							(txn, index) => (
								<TableRow key={txn.id}>
									<TableCell>{txn.expenseDate}</TableCell>
									<TableCell>{txn.description}</TableCell>
									<TableCell>{txn.amount}</TableCell>
									<TableCell>
										{/*{categoryIsFetching && (*/}
										{/*	<CircularProgress />*/}
										{/*)}*/}
										{/*{!categoryIsFetching && (*/}
										{/*	<Autocomplete*/}
										{/*		name={`category-${index}`}*/}
										{/*		control={control}*/}
										{/*		label="Category"*/}
										{/*		options={categoryOptions}*/}
										{/*	/>*/}
										{/*)}*/}
										<Autocomplete
											name={`category-${index}`}
											control={control}
											label="Category"
											options={categoryOptions ?? []}
										/>
									</TableCell>
								</TableRow>
							)
						)}
					</Table>
				</FullPageTableWrapper>
			</form>
		</div>
	);
};
