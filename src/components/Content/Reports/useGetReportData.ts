import { UseFormHandleSubmit, UseFormReturn } from 'react-hook-form';
import { Updater, useImmer } from 'use-immer';
import { PaginationState } from '../../../utils/pagination';
import { ForceUpdate, useForceUpdate } from '../../../utils/useForceUpdate';
import { CategoryOption } from '../../../types/categories';
import { useGetSpendingByMonthAndCategory } from '../../../ajaxapi/query/ReportQueries';
import { ReportPageResponse } from '../../../types/generated/expense-tracker';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { useCategoriesToCategoryOptions } from '../../../utils/categoryUtils';
import { useFormWithSearchParamSync } from '../../../routes/useFormWithSearchParamSync';
import {
	SyncFromParams,
	SyncToParams
} from '../../../routes/useSearchParamSync';

export type ReportFilterFormData = {
	readonly excludedCategories: ReadonlyArray<CategoryOption>;
};

const createOnValueHasChanged = (
	handleSubmit: UseFormHandleSubmit<ReportFilterFormData>,
	setPaginationState: Updater<PaginationState>,
	forceUpdate: ForceUpdate
) =>
	handleSubmit(() =>
		setPaginationState((draft) => {
			if (draft.pageNumber === 0) {
				forceUpdate();
			} else {
				draft.pageNumber = 0;
			}
		})
	);

type ReportData = {
	readonly pagination: {
		readonly state: PaginationState;
		readonly setState: Updater<PaginationState>;
	};
	readonly form: UseFormReturn<ReportFilterFormData>;
	readonly data: {
		readonly report?: ReportPageResponse;
		readonly categories: ReadonlyArray<CategoryOption>;
		readonly isFetching: boolean;
	};
	readonly onValueHasChanged: () => Promise<void>;
};

const formToParams: SyncToParams<ReportFilterFormData> = (form) => {
	const params = new URLSearchParams();
	const categoryString = form.excludedCategories
		.map((cat) => cat.value)
		.join(',');

	params.set('excludedCategories', categoryString);
	return params;
};

const formFromParams =
	(
		categories: ReadonlyArray<CategoryOption>
	): SyncFromParams<ReportFilterFormData> =>
	(params) => {
		const excludedCategories =
			params
				.get('excludedCategories')
				?.split(',')
				?.map(
					(cat): CategoryOption => ({
						value: cat,
						label:
							categories.find((dbCat) => dbCat.value === cat)
								?.label ?? ''
					})
				) ?? [];
		return {
			excludedCategories
		};
	};

export const useGetReportData = (): ReportData => {
	const [state, setState] = useImmer<PaginationState>({
		pageNumber: 0,
		pageSize: 10
	});

	const { isFetching: getCategoriesIsFetching, data: categoryData } =
		useGetAllCategories();

	const categories = useCategoriesToCategoryOptions(categoryData);

	const form = useFormWithSearchParamSync<ReportFilterFormData>({
		formToParams,
		formFromParams: formFromParams(categories)
	});

	const { isFetching: getReportIsFetching, data: reportData } =
		useGetSpendingByMonthAndCategory({
			pageNumber: state.pageNumber,
			pageSize: state.pageSize,
			excludeCategoryIds: form
				.getValues()
				.excludedCategories.map((cat) => cat.value)
		});

	const forceUpdate = useForceUpdate();
	const onValueHasChanged = createOnValueHasChanged(
		form.handleSubmit,
		setState,
		forceUpdate
	);

	return {
		pagination: {
			state,
			setState
		},
		form,
		data: {
			report: reportData,
			categories,
			isFetching: getReportIsFetching || getCategoriesIsFetching
		},
		onValueHasChanged
	};
};
