import allTransactions from '../../../fixtures/allTransactions.json';
import transactionDetails from '../../../fixtures/transactionDetails.json';
import possibleDuplicatesJson from '../../../fixtures/possibleDuplicates.json';
import { SelectOption } from '@craigmiller160/react-hook-form-material-ui';
import { TransactionDuplicatePageResponse } from '../../../../src/types/generated/expense-tracker';

export const possibleDuplicates =
	possibleDuplicatesJson as TransactionDuplicatePageResponse;

export { allTransactions, transactionDetails };

export const orderByOptions: ReadonlyArray<SelectOption<string>> = [
	{ value: 'ASC', label: 'Newest to Oldest' },
	{ value: 'DESC', label: 'Oldest to Newest' }
];
export const orderByOptionNames = orderByOptions.map((_) => _.label);

export const yesNoOptions: ReadonlyArray<SelectOption<string>> = [
	{ value: 'ALL', label: 'All' },
	{ value: 'YES', label: 'Yes' },
	{ value: 'NO', label: 'No' }
];
export const yesNoOptionNames = yesNoOptions.map((_) => _.label);
