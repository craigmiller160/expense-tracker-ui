import { OptionT } from '@craigmiller160/ts-functions/es/types';
import {
	TransactionResponse,
	TransactionToUpdate
} from '../../../types/transactions';
import { SideDialog } from '../../UI/SideDialog';
import { Button, CircularProgress, Typography } from '@mui/material';
import './TransactionDetailsDialog.scss';
import { Control } from 'react-hook-form';
import { DuplicateIcon } from './icons/DuplicateIcon';
import { NotConfirmedIcon } from './icons/NotConfirmedIcon';
import { NotCategorizedIcon } from './icons/NotCategorizedIcon';
import {
	Autocomplete,
	Checkbox
} from '@craigmiller160/react-hook-form-material-ui';
import { useCategoriesToCategoryOptions } from './utils';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { ReactNode } from 'react';
import {
	TransactionDetailsFormData,
	useHandleTransactionDetailsDialogData
} from './useHandleTransactionDetailsDialogData';
import { useIsAtMaxBreakpoint } from '../../../utils/breakpointHooks';

interface Props {
	readonly selectedTransaction: OptionT<TransactionResponse>;
	readonly onClose: () => void;
	readonly saveTransaction: (transaction: TransactionToUpdate) => void;
	readonly deleteTransaction: (id: string | null) => void;
}

interface DialogActionsProps {
	readonly deleteTransaction: () => void;
	readonly enableSaveButton: boolean;
}

const TransactionDetailsDialogActions = (props: DialogActionsProps) => (
	<div className="TransactionDetailsActions">
		<Button
			variant="contained"
			color="success"
			disabled={!props.enableSaveButton}
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

const useGetCategoryComponent = (
	control: Control<TransactionDetailsFormData>
): ReactNode => {
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
	const {
		transactionValues,
		form: { control, handleSubmit, formState, watch }
	} = useHandleTransactionDetailsDialogData(props.selectedTransaction);
	const CategoryComponent = useGetCategoryComponent(control);

	const Actions = (
		<TransactionDetailsDialogActions
			deleteTransaction={() =>
				props.deleteTransaction(transactionValues.id)
			}
			enableSaveButton={formState.isDirty}
		/>
	);

	const onSubmit = (values: TransactionDetailsFormData) =>
		props.saveTransaction({
			transactionId: transactionValues.id ?? '',
			categoryId: values.category?.value ?? null,
			confirmed: values.isConfirmed
		});

	const [watchedIsConfirmed, watchedCategory] = watch([
		'isConfirmed',
		'category'
	]);

	const isAtMaxSm = useIsAtMaxBreakpoint('md');
	const controlsClassName = `Controls ${isAtMaxSm ? 'small' : ''}`;

	return (
		<SideDialog
			open={transactionValues.id !== null}
			onClose={props.onClose}
			title="Transaction Details"
			actions={Actions}
			formSubmit={handleSubmit(onSubmit)}
			data-testid="transaction-details-dialog"
		>
			<div className="TransactionDetailsDialog">
				<div className="Flags">
					<DuplicateIcon
						isDuplicate={transactionValues.isDuplicate}
					/>
					<NotConfirmedIcon isNotConfirmed={!watchedIsConfirmed} />
					<NotCategorizedIcon
						isNotCategorized={watchedCategory === null}
					/>
				</div>
				<hr />
				<div className="Info">
					<div className="InfoRow">
						<Typography variant="h6">
							<strong>Expense Date</strong>
						</Typography>
						<Typography variant="h6">
							{transactionValues.expenseDate}
						</Typography>
					</div>
					<div className="InfoRow">
						<Typography variant="h6">
							<strong>Description</strong>
						</Typography>
						<Typography variant="h6">
							{transactionValues.description}
						</Typography>
					</div>
					<div className="InfoRow">
						<Typography variant="h6">
							<strong>Amount</strong>
						</Typography>
						<Typography variant="h6">
							{transactionValues.amount}
						</Typography>
					</div>
				</div>
				<hr />
				<div className={controlsClassName}>
					<Checkbox
						testId="confirm-transaction-checkbox"
						control={control}
						className={
							transactionValues.isConfirmed ? 'invisible' : ''
						}
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
