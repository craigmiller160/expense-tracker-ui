import {
	SyncFromParams,
	SyncToParams
} from '../../../routes/useSearchParamSync';
import {
	TransactionSearchForm,
	transactionSearchFormDefaultValues
} from './utils';
import { isSortDirection, SortDirection } from '../../../types/misc';
import {
	formatServerDate,
	parseServerDate
} from '../../../utils/dateTimeUtils';
import { CategoryOption } from '../../../types/categories';
import { UseFormReturn } from 'react-hook-form';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { useCategoriesToCategoryOptions } from '../../../utils/categoryUtils';
import { useFormWithSearchParamSync } from '../../../routes/useFormWithSearchParamSync';
import { setOrDeleteParam } from '../../../routes/paramUtils';
import isValid from 'date-fns/isValid/index';

const formToParams: SyncToParams<TransactionSearchForm> = (form, params) => {
	const setOrDelete = setOrDeleteParam(params);
	params.set('direction', form.direction);
	const startDate =
		form.startDate && isValid(form.startDate) ? form.startDate : undefined;
	setOrDelete('startDate', startDate, formatServerDate);
	const endDate =
		form.endDate && isValid(form.endDate) ? form.endDate : undefined;
	setOrDelete('endDate', endDate, formatServerDate);
	setOrDelete('category', form.category?.value);
	params.set('isNotConfirmed', form.isNotConfirmed.toString());
	params.set('isDuplicate', form.isDuplicate.toString());
	params.set('isNotCategorized', form.isNotCategorized.toString());
	params.set('isPossibleRefund', form.isPossibleRefund.toString());
};

const parseSortDirection = (value: string | null): SortDirection =>
	isSortDirection(value)
		? value
		: transactionSearchFormDefaultValues.direction;
const parseDate = (value: string | null): Date | null => {
	if (!value) {
		return null;
	}

	return parseServerDate(value);
};

const parseCategory = (
	categories: ReadonlyArray<CategoryOption>,
	categoryId: string | null
): CategoryOption | null => {
	if (!categoryId) {
		return null;
	}

	return categories.find((cat) => cat.value === categoryId) ?? null;
};

const parseBoolean = (value: string | null, defaultValue: boolean): boolean => {
	if (!value) {
		return defaultValue;
	}

	return /true/i.test(value);
};

const formFromParams =
	(
		categories: ReadonlyArray<CategoryOption>
	): SyncFromParams<TransactionSearchForm> =>
	(params) => {
		// TODO finish this
		const direction = parseSortDirection(params.get('direction'));
		const startDate = parseDate(params.get('startDate'));
		const endDate = parseDate(params.get('endDate'));
		const category = parseCategory(categories, params.get('category'));
		const isNotConfirmed = parseBoolean(
			params.get('isNotConfirmed'),
			transactionSearchFormDefaultValues.isNotConfirmed
		);
		const isDuplicate = parseBoolean(
			params.get('isDuplicate'),
			transactionSearchFormDefaultValues.isDuplicate
		);
		const isNotCategorized = parseBoolean(
			params.get('isNotCategorized'),
			transactionSearchFormDefaultValues.isNotCategorized
		);
		const isPossibleRefund = parseBoolean(
			params.get('isPossibleRefund'),
			transactionSearchFormDefaultValues.isPossibleRefund
		);

		return {
			direction,
			startDate,
			endDate,
			category,
			isNotCategorized,
			isNotConfirmed,
			isPossibleRefund,
			isDuplicate
		};
	};

export const useSetupFilterForm = (): UseFormReturn<TransactionSearchForm> => {
	const { data } = useGetAllCategories();
	const categories = useCategoriesToCategoryOptions(data);
	return useFormWithSearchParamSync<TransactionSearchForm>({
		formToParams,
		formFromParams: formFromParams(categories),
		formFromParamsDependencies: [categories],
		mode: 'onBlur',
		reValidateMode: 'onChange',
		defaultValues: transactionSearchFormDefaultValues
	});
};
