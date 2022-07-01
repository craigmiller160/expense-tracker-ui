import { useForm } from 'react-hook-form';

interface TransactionSearchForm {
	readonly direction: any; // TODO fix this for combobox option
	readonly startDate: any; // TODO need a date picker
	readonly endDate: any; // TODO need a date picker
	readonly categoryType: any;// TODO need a combobox
	readonly categories: any; // TODO need a combobox
}

export const TransactionSearchFilters = () => {
	const form = useForm<TransactionSearchForm>();
};
