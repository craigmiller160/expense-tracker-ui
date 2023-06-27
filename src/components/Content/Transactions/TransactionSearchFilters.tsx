import {
	UseFormGetValues,
	UseFormReturn,
	UseFormSetValue
} from 'react-hook-form';
import {
	Autocomplete,
	DatePicker,
	Select,
	SelectOption,
	TextField,
	ValueHasChanged
} from '@craigmiller160/react-hook-form-material-ui';
import { constVoid } from 'fp-ts/es6/function';
import './TransactionSearchFilters.scss';
import { SortDirection, YES_NO_FILTER_OPTIONS } from '../../../types/misc';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import {
	TransactionSearchForm,
	transactionSearchFormDefaultValues
} from './utils';
import { Button, Paper } from '@mui/material';
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

const createOnCategorizedChange =
	(
		getValues: UseFormGetValues<TransactionSearchForm>,
		setValue: UseFormSetValue<TransactionSearchForm>,
		onValueHasChanged: ValueHasChanged
	) =>
	() => {
		if (getValues().categorized === 'NO') {
			setValue('category', null);
		}
		onValueHasChanged();
	};

export const TransactionSearchFilters = (props: Props) => {
	const {
		onValueHasChanged,
		form: { getValues, control, setValue, reset }
	} = props;
	const { data } = useGetAllCategories();
	const categoryOptions = useCategoriesToCategoryOptions(data);

	const onCategorizedChange = createOnCategorizedChange(
		getValues,
		setValue,
		onValueHasChanged
	);

	const resetFilters = () => {
		reset(transactionSearchFormDefaultValues);
		onValueHasChanged();
	};

	return (
		<Paper
			className="TransactionSearchFilters"
			data-testid="transaction-filters"
		>
			<form onSubmit={constVoid}>
				<ResponsiveRow>
					<DatePicker
						id="transactionStartDateFilter"
						name="startDate"
						control={control}
						label="Start Date"
						rules={{ required: 'Start Date is required' }}
						onValueHasChanged={onValueHasChanged}
					/>
					<DatePicker
						id="transactionEndDateFilter"
						name="endDate"
						control={control}
						label="End Date"
						rules={{ required: 'End Date is required' }}
						onValueHasChanged={onValueHasChanged}
					/>
				</ResponsiveRow>
				<ResponsiveRow overrideChildWidth={{ sm: '25%' }}>
					<TextField
						id="descriptionFilter"
						control={control}
						name="description"
						label="Description"
						onValueHasChanged={onValueHasChanged}
					/>
					<Autocomplete
						id="transactionCategoryFilter"
						name="category"
						control={control}
						label="Category"
						options={categoryOptions ?? []}
						onValueHasChanged={onValueHasChanged}
						disabled={getValues().categorized === 'NO'}
					/>
					<Select
						id="transactionOrderByFilter"
						name="direction"
						options={directionOptions}
						control={control}
						label="Order By"
						onValueHasChanged={onValueHasChanged}
					/>
				</ResponsiveRow>
				<ResponsiveRow overrideChildWidth={{ sm: '15%' }}>
					<Select
						id="transactionDuplicateFilter"
						control={control}
						name="duplicate"
						label="Duplicate"
						options={YES_NO_FILTER_OPTIONS}
						onValueHasChanged={onValueHasChanged}
					/>
					<Select
						id="transactionConfirmedFilter"
						control={control}
						name="confirmed"
						label="Confirmed"
						options={YES_NO_FILTER_OPTIONS}
						onValueHasChanged={onValueHasChanged}
					/>
					<Select
						id="transactionCategorizedFilter"
						control={control}
						name="categorized"
						label="Categorized"
						options={YES_NO_FILTER_OPTIONS}
						onValueHasChanged={onCategorizedChange}
					/>
					<Select
						id="transactionPossibleRefundFilter"
						control={control}
						name="possibleRefund"
						label="Possible Refund"
						options={YES_NO_FILTER_OPTIONS}
						onValueHasChanged={onValueHasChanged}
					/>
				</ResponsiveRow>
				<ResponsiveRow>
					<Button
						id="transactionFilterResetButton"
						variant="contained"
						color="info"
						onClick={resetFilters}
					>
						Reset
					</Button>
				</ResponsiveRow>
			</form>
		</Paper>
	);
};
