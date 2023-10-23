import { types } from '@craigmiller160/ts-functions';
import { SideDialog } from '../../UI/SideDialog';
import { Button, CircularProgress, Typography } from '@mui/material';
import './TransactionDetailsDialog.scss';
import type { Control } from 'react-hook-form';
import { DuplicateIcon } from './icons/DuplicateIcon';
import { NotConfirmedIcon } from './icons/NotConfirmedIcon';
import { NotCategorizedIcon } from './icons/NotCategorizedIcon';
import {
	Autocomplete,
	Checkbox,
	DatePicker,
	TextField
} from '@craigmiller160/react-hook-form-material-ui';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import type { ReactNode } from 'react';
import type { TransactionDetailsFormData } from './useHandleTransactionDetailsDialogData';
import { useHandleTransactionDetailsDialogData } from './useHandleTransactionDetailsDialogData';
import { PossibleRefundIcon } from './icons/PossibleRefundIcon';
import * as Option from 'fp-ts/Option';
import { TransactionDetailsDuplicatePanel } from './TransactionDetailsDuplicatePanel';
import { useCategoriesToCategoryOptions } from '../../../utils/categoryUtils';
import { formatAmountValue } from '../../../utils/amountUtils';
import type { OverrideChildWidth } from '../../UI/ResponsiveWrappers/ResponsiveRow';
import { ResponsiveRow } from '../../UI/ResponsiveWrappers/ResponsiveRow';
import { Table } from '../../UI/Table';
import { RuleTableRow } from '../Rules/common/RuleTableRow';

interface Props {
	readonly open: boolean;
	readonly selectedTransactionId: types.OptionT<string>;
	readonly onClose: () => void;
	readonly saveTransaction: (transaction: TransactionDetailsFormData) => void;
	readonly deleteTransaction: (id: string | null) => void;
	readonly updateSelectedTransactionId: (id: string) => void;
}

interface DialogActionsProps {
	readonly deleteTransaction: () => void;
	readonly enableSaveButton: boolean;
	readonly showDeleteButton: boolean;
}

const TransactionDetailsDialogActions = (props: DialogActionsProps) => (
	<div className="transaction-details-actions">
		<Button
			variant="contained"
			color="success"
			disabled={!props.enableSaveButton}
			type="submit"
		>
			Save
		</Button>
		{props.showDeleteButton && (
			<Button
				variant="contained"
				color="error"
				onClick={props.deleteTransaction}
			>
				Delete
			</Button>
		)}
	</div>
);

const useGetCategoryComponent = (
	control: Control<TransactionDetailsFormData>
): ReactNode => {
	const { data: categoryData, isFetching: categoryIsFetching } =
		useGetAllCategories();
	const categoryOptions = useCategoriesToCategoryOptions(categoryData);
	if (categoryIsFetching) {
		return (
			<div className="category-spinner">
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

const LAST_RULE_COLUMNS = ['Ordinal', 'Category', 'Rule'];

export const TransactionDetailsDialog = (props: Props) => {
	const {
		transactionValues,
		isLoading,
		form: { control, handleSubmit, formState, watch },
		lastRuleApplied
	} = useHandleTransactionDetailsDialogData(
		props.selectedTransactionId,
		props.open
	);
	const CategoryComponent = useGetCategoryComponent(control);
	const isEditExisting = Option.isSome(props.selectedTransactionId);

	const { isDirty, isValid } = formState;

	const Actions = (
		<TransactionDetailsDialogActions
			deleteTransaction={() =>
				props.deleteTransaction(transactionValues.id)
			}
			enableSaveButton={isDirty && isValid}
			showDeleteButton={isEditExisting}
		/>
	);

	const onSubmit = (values: TransactionDetailsFormData) =>
		props.saveTransaction(values);

	const watchedTransaction = watch();

	const fullWidthResponsiveRows: OverrideChildWidth = {
		sm: '100%'
	};

	return (
		<SideDialog
			id="TransactionDetailsDialog"
			open={props.open}
			onClose={props.onClose}
			title="Transaction Details"
			actions={Actions}
			formSubmit={handleSubmit(onSubmit)}
			data-testid="transaction-details-dialog"
		>
			<div className="transaction-details-dialog">
				{isLoading && (
					<div className="details-spinner">
						<CircularProgress />
					</div>
				)}
				{!isLoading && (
					<>
						<div className="flags">
							<DuplicateIcon transaction={transactionValues} />
							<NotConfirmedIcon
								transaction={watchedTransaction}
							/>
							<NotCategorizedIcon
								transaction={watchedTransaction}
							/>
							<PossibleRefundIcon
								transaction={transactionValues}
							/>
						</div>
						<hr />
						<div className="info">
							<ResponsiveRow
								overrideChildWidth={fullWidthResponsiveRows}
							>
								<DatePicker
									control={control}
									name="expenseDate"
									label="Expense Date"
									rules={{
										required: 'Expense Date is required'
									}}
								/>
							</ResponsiveRow>
							<ResponsiveRow
								overrideChildWidth={fullWidthResponsiveRows}
							>
								<TextField
									control={control}
									name="amount"
									label="Amount ($)"
									rules={{
										required: 'Amount is required',
										validate: (value: unknown) =>
											/^0\.00$/.test(`${value}`)
												? 'Must provide amount'
												: undefined
									}}
									onBlurTransform={formatAmountValue}
								/>
							</ResponsiveRow>
							<ResponsiveRow
								overrideChildWidth={fullWidthResponsiveRows}
							>
								<TextField
									control={control}
									name="description"
									label="Description"
									multiline
									rules={{
										required: 'Description is required'
									}}
								/>
							</ResponsiveRow>
						</div>
						<hr />
						{!transactionValues.confirmed && lastRuleApplied && (
							<>
								<div className="last-rule-applied">
									<Typography variant="h6">
										Auto-Categorize Rule Applied
									</Typography>
									<Table
										className="LastRuleAppliedTable"
										columns={LAST_RULE_COLUMNS}
									>
										<RuleTableRow rule={lastRuleApplied} />
									</Table>
								</div>
								<hr />
							</>
						)}
						<ResponsiveRow className="Controls">
							{isEditExisting && (
								<Checkbox
									testId="confirm-transaction-checkbox"
									control={control}
									className={
										transactionValues.confirmed
											? 'invisible'
											: ''
									}
									name="confirmed"
									label="Confirmed"
									labelPlacement="end"
								/>
							)}
							{CategoryComponent}
						</ResponsiveRow>
						{isEditExisting && (
							<>
								<hr />
								<ResponsiveRow className="Timestamps">
									<span className="center">
										<strong>Created: </strong>
										{transactionValues.created}
									</span>
									<span className="center">
										<strong>Updated: </strong>
										{transactionValues.updated}
									</span>
								</ResponsiveRow>
							</>
						)}
					</>
				)}
				{transactionValues.id !== '' && transactionValues.duplicate && (
					<>
						<hr />
						<TransactionDetailsDuplicatePanel
							transactionId={transactionValues.id}
							updateSelectedTransactionId={
								props.updateSelectedTransactionId
							}
						/>
					</>
				)}
			</div>
		</SideDialog>
	);
};
