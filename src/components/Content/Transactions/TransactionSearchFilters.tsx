import { Control } from 'react-hook-form';
import {
	Autocomplete,
	SelectOption,
	Select,
	DatePicker
} from '@craigmiller160/react-hook-form-material-ui';
import { constVoid } from 'fp-ts/es6/function';
import './TransactionSearchFilters.scss';
import { TransactionCategoryType } from '../../../types/transactions';
import { SortDirection } from '../../../types/misc';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { useMemo } from 'react';
import { categoryToCategoryOption, TransactionSearchForm } from './utils';
import { Paper } from '@mui/material';

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

interface Props {
	readonly control: Control<TransactionSearchForm>;
	readonly dynamicSubmit: () => void;
}

// TODO when without category is selected, disable the Category field
// TODO add the confirmed and duplicate controls
export const TransactionSearchFilters = (props: Props) => {
	const { control, dynamicSubmit } = props;
	const { data } = useGetAllCategories();

	const categoryOptions = useMemo(
		() => data?.map(categoryToCategoryOption),
		[data]
	);

	return (
		<Paper className="TransactionSearchFilters">
			<form onSubmit={constVoid}>
				<DatePicker
					name="startDate"
					control={control}
					label="Start Date"
					rules={{ required: 'Start Date is required' }}
					dynamicSubmit={dynamicSubmit}
				/>
				<DatePicker
					name="endDate"
					control={control}
					label="End Date"
					rules={{ required: 'End Date is required' }}
					dynamicSubmit={dynamicSubmit}
				/>
				<Select
					name="categoryType"
					control={control}
					label="Categorization Status"
					options={categorizationStatusOptions}
					dynamicSubmit={dynamicSubmit}
				/>
				<Autocomplete
					name="category"
					control={control}
					label="Category"
					options={categoryOptions ?? []}
					dynamicSubmit={dynamicSubmit}
				/>
				<Select
					name="direction"
					options={directionOptions}
					control={control}
					label="Order By"
					dynamicSubmit={dynamicSubmit}
				/>
			</form>
		</Paper>
	);
};
