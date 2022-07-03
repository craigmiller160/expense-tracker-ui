import { useForm } from 'react-hook-form';
import {
	Autocomplete,
	SelectOption
} from '@craigmiller160/react-hook-form-material-ui';
import { constVoid } from 'fp-ts/es6/function';
import './TransactionSearchFilters.scss';
import { TransactionCategoryType } from '../../../types/transactions';
import { Select } from '../../UI/Form/Select';
import { SortDirection } from '../../../types/misc';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { useMemo } from 'react';
import { categoryToCategoryOption } from './utils';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import MuiTextField from '@mui/material/TextField';

interface TransactionSearchForm {
	readonly direction: SortDirection;
	readonly startDate: Date;
	readonly endDate: Date;
	readonly categoryType: TransactionCategoryType;
	readonly categories: SelectOption<string>;
}

const categorizationStatusOptions: ReadonlyArray<
	SelectOption<TransactionCategoryType>
> = [
	{ value: TransactionCategoryType.ALL, label: 'All' },
	{ value: TransactionCategoryType.WITH_CATEGORY, label: 'Categorized' },
	{ value: TransactionCategoryType.WITHOUT_CATEGORY, label: 'Uncategorized' }
];

const directionOptions: ReadonlyArray<SelectOption<SortDirection>> = [
	{ value: SortDirection.ASC, label: 'Oldest to Newest' },
	{ value: SortDirection.DESC, label: 'Newest to Oldest' }
];

export const TransactionSearchFilters = () => {
	const { data } = useGetAllCategories();
	const { control, watch } = useForm<TransactionSearchForm>({
		defaultValues: {
			categoryType: TransactionCategoryType.ALL,
			direction: SortDirection.ASC
		}
	});

	watch((data, info) => {
		console.log('FieldChange', data, info);
	});

	const categoryOptions = useMemo(
		() => data?.map(categoryToCategoryOption),
		[data]
	);

	return (
		<div className="TransactionSearchFilters">
			<form onSubmit={constVoid}>
				<DesktopDatePicker
					onChange={(value) => console.log('DateValue', value instanceof Date)}
					label="Start Date"
					value={new Date()}
					renderInput={(params) => <MuiTextField {...params} />}
				/>
				<Select
					name="categoryType"
					control={control}
					label="Categorization Status"
					options={categorizationStatusOptions}
				/>
				<Autocomplete
					name="categories"
					control={control}
					label="Category"
					options={categoryOptions ?? []}
				/>
				<Select
					name="direction"
					options={directionOptions}
					control={control}
					label="Order By"
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
