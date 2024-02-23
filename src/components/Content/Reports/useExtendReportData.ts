import type {
	ReportCategoryResponse,
	ReportMonthResponse,
	ReportPageResponse
} from '../../../types/generated/expense-tracker';
import type {
	ExtendedReportCategoryResponse,
	ExtendedReportMonthResponse,
	ExtendedReportPageResponse
} from '../../../types/reports';
import { useMemo } from 'react';

const extendCategory =
	(previousMonthCategories: ReadonlyArray<ReportCategoryResponse>) =>
	(
		currentMonthCategory: ReportCategoryResponse
	): ExtendedReportCategoryResponse => {
		const previousMonthCategory = previousMonthCategories.find(
			(cat) => cat.name === currentMonthCategory.name
		);
		return {
			...currentMonthCategory,
			amountChange: previousMonthCategory
				? currentMonthCategory.amount - previousMonthCategory.amount
				: undefined
		};
	};

const extendReport = (
	currentReport: ReportMonthResponse,
	index: number,
	array: ReadonlyArray<ReportMonthResponse>
): ExtendedReportMonthResponse => {
	const previousMonthReport: ReportMonthResponse | undefined =
		array[index + 1];

	return {
		...currentReport,
		categories: currentReport.categories.map(
			extendCategory(previousMonthReport?.categories ?? [])
		),
		totalChange: previousMonthReport
			? currentReport.total - previousMonthReport.total
			: undefined
	};
};

export const useExtendReportData = (
	data?: ReportPageResponse
): ExtendedReportPageResponse | undefined =>
	useMemo(() => {
		if (!data) {
			return undefined;
		}

		return {
			...data,
			reports: data.reports.map(extendReport)
		};
	}, [data]);
