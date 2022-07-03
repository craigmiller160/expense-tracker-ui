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
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { Paper } from '@mui/material';
import { DatePicker } from '../../UI/Form/DatePicker';

interface TransactionSearchForm {
	readonly direction: SortDirection;
	readonly startDate: Date;
	readonly endDate: Date;
	readonly categoryType: TransactionCategoryType;
	readonly category: SelectOption<string> | null;
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

const defaultStartDate = (): Date => Time.subMonths(1)(new Date());
const defaultEndDate = (): Date => new Date();

export const TransactionSearchFilters = () => {
	const { data } = useGetAllCategories();
	const { control, handleSubmit } = useForm<TransactionSearchForm>({
		mode: 'onBlur',
		reValidateMode: 'onChange',
		defaultValues: {
			categoryType: TransactionCategoryType.ALL,
			direction: SortDirection.ASC,
			startDate: defaultStartDate(),
			endDate: defaultEndDate(),
			category: null
		}
	});

	// // TODO move to hook
	// useEffect(() => {
	// 	const subscription = watch((data, info) => {
	// 		console.log('FieldChange', data, info, formState.errors);
	// 		handleSubmit(() => console.log('Submitting'))();
	// 	});
	// 	return subscription.unsubscribe;
	// }, [watch, formState]);

	const dynamicSubmit = handleSubmit((values) =>
		console.log('Submitting', values)
	);

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
				/>
				<Select
					name="direction"
					options={directionOptions}
					control={control}
					label="Order By"
				/>
			</form>
		</Paper>
	);
};
