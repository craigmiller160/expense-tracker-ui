import type { UseFormHandleSubmit, UseFormReturn } from 'react-hook-form';
import type { Updater } from 'use-immer';
import type { PaginationState } from '../../../utils/pagination';
import type { CategoryOption } from '../../../types/categories';
import { useGetSpendingByMonthAndCategory } from '../../../ajaxapi/query/ReportQueries';
import {
	useGetAllCategories,
	useGetUnknownCategory
} from '../../../ajaxapi/query/CategoryQueries';
import { useCategoriesToCategoryOptions } from '../../../utils/categoryUtils';
import { useFormWithSearchParamSync } from '../../../routes/useFormWithSearchParamSync';
import type {
	SyncFromParams,
	SyncToParams
} from '../../../routes/useSearchParamSync';
import { useCallback, useMemo } from 'react';
import type { ParamsWrapper } from '../../../routes/ParamsWrapper';
import type { StateFromParams } from '../../../routes/useImmerWithSearchParamSync';
import { useImmerWithSearchParamSync } from '../../../routes/useImmerWithSearchParamSync';
import type {
	ExtendedReportPageResponse,
	ReportCategoryIdFilterOption,
	ReportCategoryOrderBy
} from '../../../types/reports';
import {
	REPORT_CATEGORY_FILTER_OPTIONS,
	REPORT_CATEGORY_ORDER_BY_OPTIONS
} from '../../../types/reports';
import type { ReportPageResponse } from '../../../types/generated/expense-tracker';

export type ReportFilterFormData = {
	readonly categoryFilterType: ReportCategoryIdFilterOption;
	readonly categories: ReadonlyArray<CategoryOption>;
	readonly orderCategoriesBy: ReportCategoryOrderBy;
};

export const defaultReportFilterFormData: ReportFilterFormData = {
	categoryFilterType: REPORT_CATEGORY_FILTER_OPTIONS[0],
	categories: [],
	orderCategoriesBy: REPORT_CATEGORY_ORDER_BY_OPTIONS[0].value
};

const createOnValueHasChanged = (
	handleSubmit: UseFormHandleSubmit<ReportFilterFormData>,
	setPaginationState: Updater<PaginationState>
) =>
	handleSubmit(() =>
		setPaginationState((draft) => {
			draft.pageNumber = 0;
		})
	);

type ReportData = Readonly<{
	pagination: Readonly<{
		state: PaginationState;
		setState: Updater<PaginationState>;
	}>;
	form: UseFormReturn<ReportFilterFormData>;
	data: Readonly<{
		report?: ExtendedReportPageResponse;
		categories: ReadonlyArray<CategoryOption>;
		isFetching: boolean;
	}>;
	onValueHasChanged: () => Promise<void> | undefined;
}>;

const formToParams: SyncToParams<ReportFilterFormData> = (form, params) => {
	const categoryString = form.categories.map((cat) => cat.value).join(',');

	params.setOrDelete('categoryFilterType', form.categoryFilterType.value);
	params.setOrDelete('categories', categoryString);
	params.setOrDelete('orderCategoriesBy', form.orderCategoriesBy);
};

const formFromParams =
	(
		allCategories?: ReadonlyArray<CategoryOption>
	): SyncFromParams<ReportFilterFormData> =>
	(params) => {
		const categories =
			params
				.getOrDefault('categories', '')
				.split(',')
				.map(
					(cat): CategoryOption => ({
						value: cat,
						label:
							allCategories?.find((dbCat) => dbCat.value === cat)
								?.label ?? ''
					})
				)
				.filter((option) => option.label !== '') ??
			defaultReportFilterFormData.categories;
		const categoryFilterTypeValue = params.getOrDefault(
			'categoryFilterType',
			defaultReportFilterFormData.categoryFilterType.value
		);
		const orderCategoriesByValue = params.getOrDefault(
			'orderCategoriesBy',
			defaultReportFilterFormData.orderCategoriesBy
		);
		return {
			categories,
			categoryFilterType:
				REPORT_CATEGORY_FILTER_OPTIONS.find(
					(type) => type.value === categoryFilterTypeValue
				) ?? REPORT_CATEGORY_FILTER_OPTIONS[0],
			orderCategoriesBy: orderCategoriesByValue
		};
	};

const DEFAULT_PAGE_SIZE = 10;

const stateToParams: SyncToParams<PaginationState> = (state, params) => {
	params.setOrDelete('pageNumber', state.pageNumber.toString());
	params.setOrDelete('pageSize', state.pageSize.toString());
};
const stateFromParams: StateFromParams<PaginationState> = (draft, params) => {
	draft.pageNumber = params.getOrDefault('pageNumber', 0, parseInt);
	draft.pageSize = params.getOrDefault(
		'pageSize',
		DEFAULT_PAGE_SIZE,
		parseInt
	);
};

const useExtendReportData = (
	data?: ReportPageResponse
): ExtendedReportPageResponse | undefined =>
	useMemo(() => {
		// TODO finish this
		return undefined;
	}, [data]);

export const useGetReportData = (): ReportData => {
	const [state, setState] = useImmerWithSearchParamSync<PaginationState>({
		stateToParams,
		stateFromParams,
		initialState: {
			pageNumber: 0,
			pageSize: DEFAULT_PAGE_SIZE
		}
	});

	const { isFetching: getUnknownCategoryIsFetching, data: unknownCategory } =
		useGetUnknownCategory();

	const { isFetching: getCategoriesIsFetching, data: categoryData } =
		useGetAllCategories();

	const categories = useCategoriesToCategoryOptions(
		categoryData,
		unknownCategory
	);
	const memoizedFormFromParams = useCallback(
		(params: ParamsWrapper<ReportFilterFormData>) =>
			formFromParams(categories)(params),
		[categories]
	);

	const form = useFormWithSearchParamSync<ReportFilterFormData>({
		formToParams,
		formFromParams: memoizedFormFromParams,
		formFromParamsDependencies: [categories],
		defaultValues: defaultReportFilterFormData
	});

	const { isFetching: getReportIsFetching, data: reportData } =
		useGetSpendingByMonthAndCategory({
			pageNumber: state.pageNumber,
			pageSize: state.pageSize,
			categoryIdType:
				form.getValues().categoryFilterType?.value ??
				REPORT_CATEGORY_FILTER_OPTIONS[0].value,
			categoryIds:
				form.getValues().categories?.map((cat) => cat.value) ?? []
		});
	const extendedReportData = useExtendReportData(reportData);

	const onValueHasChanged = createOnValueHasChanged(
		form.handleSubmit,
		setState
	);

	return {
		pagination: {
			state,
			setState
		},
		form,
		data: {
			report: extendedReportData,
			categories,
			isFetching:
				getReportIsFetching ||
				getCategoriesIsFetching ||
				getUnknownCategoryIsFetching
		},
		onValueHasChanged
	};
};
