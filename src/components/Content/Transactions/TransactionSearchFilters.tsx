/* eslint-disable */
import { useForm } from 'react-hook-form';
import { TextField } from '@craigmiller160/react-hook-form-material-ui';
import { useEffect } from 'react';

interface TransactionSearchForm {
	readonly direction: any; // TODO fix this for combobox option
	readonly startDate: any; // TODO need a date picker
	readonly endDate: any; // TODO need a date picker
	readonly categoryType: any; // TODO need a combobox
	readonly categories: any; // TODO need a combobox
}

export const TransactionSearchFilters = () => {
	const { control, handleSubmit, watch } = useForm<TransactionSearchForm>();

	const onSubmit = (values: TransactionSearchForm) => console.log('Values', values);

	useEffect(() => {
		const subscription = watch(handleSubmit(onSubmit));
		return () => subscription.unsubscribe();
	}, [handleSubmit, watch]);

	return (
		<div>
			<form>
				<TextField name="direction" control={control} label="Direction" />
				<TextField name="startDate" control={control} label="Start Date" />
			</form>
		</div>
	)
};
