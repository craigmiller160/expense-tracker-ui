import allTransactions from '../../../fixtures/allTransactions.json';
import transactionDetails from '../../../fixtures/transactionDetails.json';
import possibleDuplicates from '../../../fixtures/possibleDuplicates.json';
import { SelectOption } from '@craigmiller160/react-hook-form-material-ui';

export { allTransactions, transactionDetails, possibleDuplicates };

export const orderByOptions: ReadonlyArray<SelectOption<string>> = [
	{ value: 'ASC', label: 'Newest to Oldest' },
	{ value: 'DESC', label: 'Oldest to Newest' }
];
export const orderByOptionNames = orderByOptions.map((_) => _.label);

export const confirmedOptions: ReadonlyArray<SelectOption<string>> = [
	{ value: 'ALL', label: 'All' },
	{ value: 'YES', label: 'Yes' },
	{ value: 'NO', label: 'No' }
];
export const confirmedOptionNames = confirmedOptions.map((_) => _.label);
