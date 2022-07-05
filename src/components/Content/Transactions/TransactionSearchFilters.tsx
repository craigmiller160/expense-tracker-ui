import { UseFormReturn } from 'react-hook-form';
import {
	Autocomplete,
	DatePicker,
	Select,
	SelectOption
} from '@craigmiller160/react-hook-form-material-ui';
import { constVoid } from 'fp-ts/es6/function';
import './TransactionSearchFilters.scss';
import { SortDirection } from '../../../types/misc';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { useMemo } from 'react';
import { categoryToCategoryOption, TransactionSearchForm } from './utils';
import { Paper } from '@mui/material';
import { Checkbox } from '../../UI/Checkbox';

const directionOptions: ReadonlyArray<SelectOption<SortDirection>> = [
	{ value: SortDirection.ASC, label: 'Oldest to Newest' },
	{ value: SortDirection.DESC, label: 'Newest to Oldest' }
];

interface Props {
	readonly form: UseFormReturn<TransactionSearchForm>;
	readonly dynamicSubmit: () => void;
}

// TODO when without category is selected, disable the Category field
export const TransactionSearchFilters = (props: Props) => {
	const {
		dynamicSubmit,
		form: { getValues, control }
	} = props;
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
					<Checkbox
						control={control}
						name="isDuplicate"
						label="Is Duplicate"
					/>
					<p>Is Not Confirmed</p>
					<p>Is Not Categorized</p>
				</div>
			</form>
		</Paper>
	);
};
