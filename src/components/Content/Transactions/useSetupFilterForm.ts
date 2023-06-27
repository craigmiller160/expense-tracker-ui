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
import { ParamsWrapper } from '../../../routes/ParamsWrapper';
import isValid from 'date-fns/isValid/index';
import { useCallback } from 'react';

const formToParams: SyncToParams<TransactionSearchForm> = (form, params) => {
	params.setOrDelete('direction', form.direction);
	const startDate =
		form.startDate && isValid(form.startDate) ? form.startDate : undefined;
	params.setOrDelete('startDate', startDate, formatServerDate);
	const endDate =
		form.endDate && isValid(form.endDate) ? form.endDate : undefined;
	params.setOrDelete('endDate', endDate, formatServerDate);
	params.setOrDelete('category', form.category?.value);
	params.setOrDelete('confirmed', form.confirmed);
	params.setOrDelete('duplicate', form.duplicate);
	params.setOrDelete('categorized', form.categorized);
	params.setOrDelete('possibleRefund', form.possibleRefund);
	params.setOrDelete('description', form.description);
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

const parseCategory =
	(categories: ReadonlyArray<CategoryOption>) =>
	(categoryId: string | null): CategoryOption | null => {
		if (!categoryId) {
			return null;
		}

		return categories.find((cat) => cat.value === categoryId) ?? null;
	};

const formFromParams =
	(
		categories: ReadonlyArray<CategoryOption>
	): SyncFromParams<TransactionSearchForm> =>
	(params) => {
		const direction = params.getOrDefault(
			'direction',
			transactionSearchFormDefaultValues.direction,
			parseSortDirection
		);
		const startDate = params.getOrDefault('startDate', null, parseDate);
		const endDate = params.getOrDefault('endDate', null, parseDate);
		const category = params.getOrDefault(
			'category',
			null,
			parseCategory(categories)
		);
		const confirmed = params.getOrDefault(
			'confirmed',
			transactionSearchFormDefaultValues.confirmed
		);
		const duplicate = params.getOrDefault(
			'duplicate',
			transactionSearchFormDefaultValues.duplicate
		);
		const categorized = params.getOrDefault(
			'categorized',
			transactionSearchFormDefaultValues.categorized
		);
		const possibleRefund = params.getOrDefault(
			'possibleRefund',
			transactionSearchFormDefaultValues.possibleRefund
		);
		const description = params.getOrDefault(
			'description',
			transactionSearchFormDefaultValues.description
		);

		return {
			direction,
			startDate,
			endDate,
			category,
			categorized,
			confirmed,
			possibleRefund,
			duplicate,
			description
		};
	};

export const useSetupFilterForm = (): UseFormReturn<TransactionSearchForm> => {
	const { data } = useGetAllCategories();
	const categories = useCategoriesToCategoryOptions(data);
	const memoizedFormFromParams = useCallback(
		(params: ParamsWrapper<TransactionSearchForm>) =>
			formFromParams(categories)(params),
		[categories]
	);
	return useFormWithSearchParamSync<TransactionSearchForm>({
		formToParams,
		formFromParams: memoizedFormFromParams,
		formFromParamsDependencies: [categories],
		mode: 'onBlur',
		reValidateMode: 'onChange',
		defaultValues: transactionSearchFormDefaultValues
	});
};
