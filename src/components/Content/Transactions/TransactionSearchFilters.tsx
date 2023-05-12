import {
	UseFormGetValues,
	UseFormReturn,
	UseFormSetValue
} from 'react-hook-form';
import {
	Autocomplete,
	Checkbox,
	DatePicker,
	Select,
	SelectOption,
	ValueHasChanged
} from '@craigmiller160/react-hook-form-material-ui';
import { constVoid } from 'fp-ts/es6/function';
import './TransactionSearchFilters.scss';
import { SortDirection } from '../../../types/misc';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { TransactionSearchForm } from './utils';
import { Paper } from '@mui/material';
import { ResponsiveRow } from '../../UI/ResponsiveWrappers/ResponsiveRow';
import { useCategoriesToCategoryOptions } from '../../../utils/categoryUtils';

const directionOptions: ReadonlyArray<SelectOption<SortDirection>> = [
	{ value: SortDirection.DESC, label: 'Newest to Oldest' },
	{ value: SortDirection.ASC, label: 'Oldest to Newest' }
];

interface Props {
	readonly form: UseFormReturn<TransactionSearchForm>;
	readonly onValueHasChanged: ValueHasChanged;
}

const createOnIsNotCategorizedChanged =
	(
		getValues: UseFormGetValues<TransactionSearchForm>,
		setValue: UseFormSetValue<TransactionSearchForm>,
		onValueHasChanged: ValueHasChanged
	) =>
	() => {
		if (getValues().isNotCategorized) {
			setValue('category', null);
		}
		onValueHasChanged();
	};

export const TransactionSearchFilters = (props: Props) => {
	const {
		onValueHasChanged,
		form: { getValues, control, setValue }
	} = props;
	const { data } = useGetAllCategories();
	const categoryOptions = useCategoriesToCategoryOptions(data);

	const onIsNotCategorizedChanged = createOnIsNotCategorizedChanged(
		getValues,
		setValue,
		onValueHasChanged
	);

	return (
		<Paper
			className="TransactionSearchFilters"
			data-testid="transaction-filters"
		>
			<form onSubmit={constVoid}>
				<ResponsiveRow>
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
				</ResponsiveRow>
				<ResponsiveRow>
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
				</ResponsiveRow>
				<ResponsiveRow>
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
					<Checkbox
						control={control}
						name="isPossibleRefund"
						label="Is Possible Refund"
						onValueHasChanged={onValueHasChanged}
					/>
				</ResponsiveRow>
			</form>
		</Paper>
	);
};
