import { useForm } from 'react-hook-form';
import {
	SelectOption,
	TextField
} from '@craigmiller160/react-hook-form-material-ui';
import { constVoid } from 'fp-ts/es6/function';
import './TransactionSearchFilters.scss';
import { TransactionCategoryType } from '../../../types/transactions';
import { Select } from '../../UI/Form/Select';

interface TransactionSearchForm {
	readonly direction: any; // TODO fix this for combobox option
	readonly startDate: any; // TODO need a date picker
	readonly endDate: any; // TODO need a date picker
	readonly categoryType: any; // TODO need a combobox
	readonly categories: any; // TODO need a combobox
}

const categorizationStatusOptions: ReadonlyArray<
	SelectOption<TransactionCategoryType>
> = [
	{ value: TransactionCategoryType.ALL, label: 'All' },
	{ value: TransactionCategoryType.WITH_CATEGORY, label: 'Categorized' },
	{ value: TransactionCategoryType.WITHOUT_CATEGORY, label: 'Uncategorized' }
];

export const TransactionSearchFilters = () => {
	const { control, watch } = useForm<TransactionSearchForm>({
		defaultValues: {
			categoryType: TransactionCategoryType.ALL
		}
	});

	watch((data, info) => {
		console.log('FieldChange', data, info);
	});

	return (
		<div className="TransactionSearchFilters">
			<form onSubmit={constVoid}>
				{/*<TextField*/}
				{/*	name="startDate"*/}
				{/*	control={control}*/}
				{/*	label="Start Date"*/}
				{/*/>*/}
				{/*<TextField name="endDate" control={control} label="End Date" />*/}
				<Select
					name="categoryType"
					control={control}
					label="Categorization Status"
					options={categorizationStatusOptions}
				/>
				{/*<TextField*/}
				{/*	name="categories"*/}
				{/*	control={control}*/}
				{/*	label="Category"*/}
				{/*/>*/}
				{/*<TextField*/}
				{/*	name="direction"*/}
				{/*	control={control}*/}
				{/*	label="Order By"*/}
				{/*/>*/}
			</form>
		</div>
	);
};
