import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { TransactionResponse } from '../../../types/transactions';
import { SideDialog } from '../../UI/SideDialog';
import * as Option from 'fp-ts/es6/Option';
import { Button, CircularProgress, FormControl, Typography } from '@mui/material';
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
import { CategoryOption, useCategoriesToCategoryOptions } from './utils';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';

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
	readonly hasTransaction: boolean;
	readonly isConfirmed: boolean;
};

const getValuesFromSelectedTransaction = (
	selectedTransaction: OptionT<TransactionResponse>
): TransactionValues =>
	pipe(
		selectedTransaction,
		Option.map(
			(transaction): TransactionValues => ({
				hasTransaction: true,
				isConfirmed: transaction.confirmed
			})
		),
		Option.getOrElse(
			(): TransactionValues => ({
				hasTransaction: false,
				isConfirmed: false
			})
		)
	);

// TODO need response type
const useGetCategoryComponent = (control: Control<FormData>) => {
	const { data: categoryData, isFetching: categoryIsFetching } =
		useGetAllCategories();
	const categoryOptions = useCategoriesToCategoryOptions(categoryData);
	if (categoryIsFetching) {
		return <CircularProgress />;
	}

	return (
		<Autocomplete
			testId="transaction-category-select"
			name="category"
			control={control}
			label="Category"
			options={categoryOptions}
		/>
	);
};

export const TransactionDetailsDialog = (props: Props) => {
	// TODO need to make sure the flags change with user interaction
	const { hasTransaction, ...defaultValues } =
		getValuesFromSelectedTransaction(props.selectedTransaction);
	// TODO set default values based on selected transaction
	const { handleSubmit, control, reset, formState } = useForm<FormData>({
		defaultValues: {
			isConfirmed: defaultValues.isConfirmed
		}
	});
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
			open={hasTransaction}
			onClose={props.onClose}
			title="Transaction Details"
			actions={Actions}
			formSubmit={handleSubmit(onSubmit)}
		>
			<div className="TransactionDetailsDialog">
				<div className="Flags">
					<DuplicateIcon
						isDuplicate={getDuplicate(props.selectedTransaction)}
					/>
					<NotConfirmedIcon
						isNotConfirmed={getNotConfirmed(
							props.selectedTransaction
						)}
					/>
					<NotCategorizedIcon
						isNotCategorized={getNotCategorized(
							props.selectedTransaction
						)}
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
					<form onSubmit={handleSubmit(onSubmit)}>
						{/* TODO hide the checkbox if already confirmed */}
						<Checkbox
							testId="confirm-transaction-checkbox"
							control={control}
							name="isConfirmed"
							label=""
							labelPlacement="top"
						/>
						{CategoryComponent}
					</form>
					<h3>Confirmed Checkbox and Category Select Go Here</h3>
				</div>
			</div>
		</SideDialog>
	);
};
