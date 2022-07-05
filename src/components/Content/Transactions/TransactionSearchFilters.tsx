import { UseFormReturn } from 'react-hook-form';
import {
	Autocomplete,
	DatePicker,
	Select,
	SelectOption,
	ValueHasChanged,
	Checkbox
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
	readonly form: UseFormReturn<TransactionSearchForm>;
	readonly onValueHasChanged: ValueHasChanged;
}

// TODO when without category is selected, disable the Category field
export const TransactionSearchFilters = (props: Props) => {
	const {
		onValueHasChanged,
		form: { getValues, control, setValue }
	} = props;
	const { data } = useGetAllCategories();

	const categoryOptions = useMemo(
		() => data?.map(categoryToCategoryOption),
		[data]
	);

	const onIsNotCategorizedChanged = () => {
		if (getValues().isNotCategorized) {
			setValue('category', null);
		}
		onValueHasChanged();
	};

	return (
		<Paper className="TransactionSearchFilters">
			<form onSubmit={constVoid}>
				<div className="row">
					<DatePicker
						name="startDate"
						control={control}
						label="Start Date"
						rules={{ required: 'Start Date is required' }}
						onValueHasChanged={onValueHasChanged}
					/>
					<DatePicker
						name="endDate"
						control={control}
						label="End Date"
						rules={{ required: 'End Date is required' }}
						onValueHasChanged={onValueHasChanged}
					/>
				</div>
				<div className="row">
					<Autocomplete
						name="category"
						control={control}
						label="Category"
						options={categoryOptions ?? []}
						onValueHasChanged={onValueHasChanged}
						disabled={getValues().isNotCategorized}
					/>
					<Select
						name="direction"
						options={directionOptions}
						control={control}
						label="Order By"
						onValueHasChanged={onValueHasChanged}
					/>
				</div>
				<div className="row">
					<Checkbox
						control={control}
						name="isDuplicate"
						label="Is Duplicate"
						onValueHasChanged={onValueHasChanged}
					/>
					<Checkbox
						control={control}
						name="isNotConfirmed"
						label="Is Not Confirmed"
						onValueHasChanged={onValueHasChanged}
					/>
					<Checkbox
						control={control}
						name="isNotCategorized"
						label="Is Not Categorized"
						onValueHasChanged={onIsNotCategorizedChanged}
					/>
				</div>
			</form>
		</Paper>
	);
};
