import { memo } from 'react';
import { Table } from '../../UI/Table';
import { Button, TableCell, TableRow } from '@mui/material';
import {
	Autocomplete,
	Checkbox
} from '@craigmiller160/react-hook-form-material-ui';
import { formatCurrency } from '../../../utils/formatNumbers';
import { NotConfirmedIcon } from './icons/NotConfirmedIcon';
import { DuplicateIcon } from './icons/DuplicateIcon';
import { NotCategorizedIcon } from './icons/NotCategorizedIcon';
import { PossibleRefundIcon } from './icons/PossibleRefundIcon';
import { Control, DeepPartial, UseFormReturn } from 'react-hook-form';
import {
	TransactionFormValues,
	TransactionTableForm,
	TransactionTableUseFormReturn
} from './useHandleTransactionTableData';
import { useIsEditMode } from './TransactionTableUtils';
import { ReactNode } from 'react';

type Props = Readonly<{
	watchedTransactions: ReadonlyArray<DeepPartial<TransactionFormValues>>;
	form: TransactionTableUseFormReturn;
	onSubmit: (f: TransactionTableForm) => void;
}>;

const COLUMNS: ReadonlyArray<string | ReactNode> = [
	'Expense Date',
	'Description',
	'Amount',
	'Category',
	'Flags',
	'Details'
];

const createEditModeColumns = (
	control: Control<TransactionTableForm>
): ReadonlyArray<string | ReactNode> => [
	<Checkbox
		className="ConfirmAllCheckbox"
		key="confirmAll"
		control={control}
		name="confirmAll"
		label="Confirm All"
		labelPlacement="top"
	/>,
	...COLUMNS
];

// TODO need unit test for this
const arePropsEqual = (prevProps: Props, nextProps: Props): boolean =>
	Object.entries(nextProps).filter(([key, value]) => {
		if (typeof value === 'function') {
			return true;
		}
		return value === prevProps[key];
	}).length === 0;

export const TransactionTable = memo((props: Props) => {
	const editMode = useIsEditMode();
	const editClass = editMode ? 'edit' : '';
	const {
		watchedTransactions,
		form: {
			formReturn: { setValue, control, handleSubmit, formState },
			fields
		},
		onSubmit
	} = props;

	const editModeColumns = createEditModeColumns(control);

	return (
		<div className={`TransactionsTable ${editClass}`}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Table
					columns={editMode ? editModeColumns : COLUMNS}
					loading={isFetching}
					pagination={tablePagination}
					aboveTableActions={aboveTableActions}
					belowTableActions={belowTableActions}
					data-testid="transactions-table"
				>
					{fields.map((field, index) => {
						const txn = transactions[index];
						if (!txn) {
							return <span key={index}></span>;
						}
						return (
							<TableRow
								key={txn.id}
								data-testid="transaction-table-row"
							>
								{editMode && (
									<TableCell className="ConfirmedCell">
										{!txn.confirmed && (
											<Checkbox
												testId="confirm-transaction-checkbox"
												control={control}
												name={`transactions.${index}.confirmed`}
												label=""
												labelPlacement="top"
											/>
										)}
									</TableCell>
								)}
								<TableCell data-testid="transaction-expense-date">
									{txn.expenseDate}
								</TableCell>
								<TableCell
									className="DescriptionCell"
									data-testid="transaction-description"
								>
									{txn.description}
								</TableCell>
								<TableCell>
									{formatCurrency(txn.amount)}
								</TableCell>
								<TableCell
									className={`CategoryCell ${editClass}`}
								>
									{editMode && (
										<Autocomplete
											testId="transaction-category-select"
											name={`transactions.${index}.category`}
											control={control}
											label="Category"
											options={categories}
										/>
									)}
									{!editMode && txn.categoryName}
								</TableCell>
								<TableCell>
									<div className="FlagsWrapper">
										<div className="FlagRow">
											<NotConfirmedIcon
												transaction={
													watchedTransactions[index]
												}
											/>
											<DuplicateIcon transaction={txn} />
										</div>
										<div className="FlagRow">
											<NotCategorizedIcon
												transaction={
													watchedTransactions[index]
												}
											/>
											<PossibleRefundIcon
												transaction={txn}
											/>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<Button
										className="DetailsButton"
										variant="contained"
										color="info"
										disabled={formState.isDirty}
										onClick={() =>
											props.openDetailsDialog(txn.id)
										}
									>
										Details
									</Button>
								</TableCell>
							</TableRow>
						);
					})}
				</Table>
			</form>
		</div>
	);
}, arePropsEqual);
TransactionTable.displayName = 'TransactionTable';
