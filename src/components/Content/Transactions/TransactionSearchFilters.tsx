import { Control, UseFormGetValues } from 'react-hook-form';
import {
	Autocomplete,
	SelectOption,
	Select,
	DatePicker
} from '@craigmiller160/react-hook-form-material-ui';
import { constVoid } from 'fp-ts/es6/function';
import './TransactionSearchFilters.scss';
import { SortDirection } from '../../../types/misc';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { useMemo } from 'react';
import { categoryToCategoryOption, TransactionSearchForm } from './utils';
import { Paper } from '@mui/material';

const directionOptions: ReadonlyArray<SelectOption<SortDirection>> = [
	{ value: SortDirection.ASC, label: 'Oldest to Newest' },
	{ value: SortDirection.DESC, label: 'Newest to Oldest' }
];

interface Props {
	readonly control: Control<TransactionSearchForm>;
	readonly dynamicSubmit: () => void;
	readonly getValues: UseFormGetValues<TransactionSearchForm>;
}

// TODO when without category is selected, disable the Category field
export const TransactionSearchFilters = (props: Props) => {
	const { control, dynamicSubmit, getValues } = props;
	const { data } = useGetAllCategories();

	const categoryOptions = useMemo(
		() => data?.map(categoryToCategoryOption),
		[data]
	);

	return (
		<Paper className="TransactionSearchFilters">
			<form onSubmit={constVoid}>
				<div className="row">
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
				</div>
				<div className="row">
					<Autocomplete
						name="category"
						control={control}
						label="Category"
						options={categoryOptions ?? []}
						dynamicSubmit={dynamicSubmit}
						disabled={getValues().isNotCategorized}
					/>
					<Select
						name="direction"
						options={directionOptions}
						control={control}
						label="Order By"
						dynamicSubmit={dynamicSubmit}
					/>
				</div>
				<div className="row">
					<p>Is Duplicate</p>
					<p>Is Not Confirmed</p>
					<p>Is Not Categorized</p>
				</div>
			</form>
		</Paper>
	);
};
