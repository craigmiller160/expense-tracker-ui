import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { TransactionResponse } from '../../../types/transactions';
import { SideDialog } from '../../UI/SideDialog';
import * as Option from 'fp-ts/es6/Option';
import {
	Button,
	CircularProgress,
	FormControl,
	Typography
} from '@mui/material';
import { flow, pipe } from 'fp-ts/es6/function';
import './TransactionDetailsDialog.scss';
import { Control, useForm } from 'react-hook-form';
import { DuplicateIcon } from './icons/DuplicateIcon';
import { NotConfirmedIcon } from './icons/NotConfirmedIcon';
import { NotCategorizedIcon } from './icons/NotCategorizedIcon';
import { formatCurrency } from '../../../utils/formatCurrency';
import {
	Autocomplete,
	Checkbox
} from '@craigmiller160/react-hook-form-material-ui';
import {
	CategoryOption,
	transactionToCategoryOption,
	useCategoriesToCategoryOptions
} from './utils';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { ReactNode, useEffect, useMemo } from 'react';

// TODO be sure to test this in mobile view, needs some layout tweaks

interface FormData {
	readonly isConfirmed: boolean;
	readonly category: CategoryOption | null;
}

interface Props {
	readonly selectedTransaction: OptionT<TransactionResponse>;
	readonly onClose: () => void;
	readonly saveTransaction: (transaction: TransactionResponse) => void;
	readonly deleteTransaction: (id: string) => void;
}

interface DialogActionsProps {
	readonly deleteTransaction: () => void;
}

const TransactionDetailsDialogActions = (props: DialogActionsProps) => (
	<div className="TransactionDetailsActions">
		<Button
			variant="contained"
			color="success"
			disabled={true}
			type="submit"
		>
			Save
		</Button>
		<Button
			variant="contained"
			color="error"
			onClick={props.deleteTransaction}
		>
			Delete
		</Button>
	</div>
);

const getId: (txn: OptionT<TransactionResponse>) => string = flow(
	Option.map((txn) => txn.id),
	Option.getOrElse(() => '')
);
const getDuplicate: (txn: OptionT<TransactionResponse>) => boolean =
	Option.exists((txn) => txn.duplicate);
const getNotConfirmed: (txn: OptionT<TransactionResponse>) => boolean =
	Option.exists((txn) => !txn.confirmed);
const getNotCategorized: (txn: OptionT<TransactionResponse>) => boolean =
	Option.exists((txn) => !txn.categoryId);
const getDate: (txn: OptionT<TransactionResponse>) => string = flow(
	Option.map((txn) => txn.expenseDate),
	Option.getOrElse(() => '')
);
const getDescription: (txn: OptionT<TransactionResponse>) => string = flow(
	Option.map((txn) => txn.description),
	Option.getOrElse(() => '')
);
const getAmount: (txn: OptionT<TransactionResponse>) => string = flow(
	Option.map((txn) => txn.amount),
	Option.map(formatCurrency),
	Option.getOrElse(() => '')
);

type TransactionValues = {
	readonly id: string | null;
	readonly isConfirmed: boolean;
	readonly isDuplicate: boolean;
	readonly category: CategoryOption | null;
};

const useValuesFromSelectedTransaction = (
	selectedTransaction: OptionT<TransactionResponse>
): TransactionValues =>
	pipe(
		selectedTransaction,
		Option.map(
			(transaction): TransactionValues => ({
				id: transaction.id,
				isConfirmed: transaction.confirmed,
				isDuplicate: transaction.duplicate,
				category: transactionToCategoryOption(transaction)
			})
		),
		Option.getOrElse(
			(): TransactionValues => ({
				id: null,
				isConfirmed: false,
				isDuplicate: false,
				category: null
			})
		)
	);

const useGetCategoryComponent = (control: Control<FormData>): ReactNode => {
	const { data: categoryData, isFetching: categoryIsFetching } =
		useGetAllCategories();
	const categoryOptions = useCategoriesToCategoryOptions(categoryData);
	if (categoryIsFetching) {
		return (
			<div className="CategorySpinner">
				<CircularProgress />
			</div>
		);
	}

	return (
		<Autocomplete
			name="category"
			control={control}
			label="Category"
			options={categoryOptions}
		/>
	);
};

export const TransactionDetailsDialog = (props: Props) => {
	// TODO need to make sure the flags change with user interaction
	const defaultValues = useValuesFromSelectedTransaction(
		props.selectedTransaction
	);
	const { handleSubmit, control, reset, formState, getValues } =
		useForm<FormData>({
			defaultValues: {
				isConfirmed: defaultValues.isConfirmed,
				category: defaultValues.category
			}
		});
	useEffect(() => {
		reset({
			isConfirmed: defaultValues.isConfirmed,
			category: defaultValues.category
		});
	}, [defaultValues.id, reset]);
	const CategoryComponent = useGetCategoryComponent(control);

	const Actions = (
		<TransactionDetailsDialogActions
			deleteTransaction={() =>
				props.deleteTransaction(getId(props.selectedTransaction))
			}
		/>
	);

	const onSubmit = (values: FormData) => {};

	return (
		<SideDialog
			open={defaultValues.id !== null}
			onClose={props.onClose}
			title="Transaction Details"
			actions={Actions}
			formSubmit={handleSubmit(onSubmit)}
		>
			<div className="TransactionDetailsDialog">
				<div className="Flags">
					<DuplicateIcon isDuplicate={defaultValues.isDuplicate} />
					<NotConfirmedIcon
						isNotConfirmed={getValues().isConfirmed}
					/>
					<NotCategorizedIcon
						isNotCategorized={getValues().category === null}
					/>
				</div>
				<hr />
				<div className="Info">
					<div className="InfoRow">
						<Typography variant="h6">
							<strong>Expense Date</strong>
						</Typography>
						<Typography variant="h6">
							{getDate(props.selectedTransaction)}
						</Typography>
					</div>
					<div className="InfoRow">
						<Typography variant="h6">
							<strong>Description</strong>
						</Typography>
						<Typography variant="h6">
							{getDescription(props.selectedTransaction)}
						</Typography>
					</div>
					<div className="InfoRow">
						<Typography variant="h6">
							<strong>Amount</strong>
						</Typography>
						<Typography variant="h6">
							{getAmount(props.selectedTransaction)}
						</Typography>
					</div>
				</div>
				<hr />
				<div className="Controls">
					<Checkbox
						testId="confirm-transaction-checkbox"
						control={control}
						className={defaultValues.isConfirmed ? 'invisible' : ''}
						name="isConfirmed"
						label="Confirmed"
						labelPlacement="end"
					/>
					{CategoryComponent}
				</div>
			</div>
		</SideDialog>
	);
};
