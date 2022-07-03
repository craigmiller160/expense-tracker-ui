import { useForm } from 'react-hook-form';
import { TextField } from '@craigmiller160/react-hook-form-material-ui';
import { constVoid } from 'fp-ts/es6/function';
import './TransactionSearchFilters.scss';

interface TransactionSearchForm {
	readonly direction: any; // TODO fix this for combobox option
	readonly startDate: any; // TODO need a date picker
	readonly endDate: any; // TODO need a date picker
	readonly categoryType: any; // TODO need a combobox
	readonly categories: any; // TODO need a combobox
}

export const TransactionSearchFilters = () => {
	const { control, watch } = useForm<TransactionSearchForm>();

	watch((data, info) => {
		console.log('FieldChange', data, info);
	});

	return (
		<div className="TransactionSearchFilters">
			<form onSubmit={constVoid}>
				<TextField
					name="startDate"
					control={control}
					label="Start Date"
				/>
				<TextField name="endDate" control={control} label="End Date" />
				<TextField
					name="categoryType"
					control={control}
					label="With Categories"
				/>
				<TextField
					name="categoryType"
					control={control}
					label="Category"
				/>
				<TextField
					name="direction"
					control={control}
					label="Order By"
				/>
			</form>
		</div>
	);
};
