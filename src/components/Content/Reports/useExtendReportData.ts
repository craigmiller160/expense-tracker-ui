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
		const { amount: previousAmount } = previousMonthCategories.find(
			(cat) => cat.name === currentMonthCategory.name
		) ?? {
			amount: 0
		};
		return {
			...currentMonthCategory,
			amountChange: currentMonthCategory.amount - previousAmount
		};
	};

const extendReport = (
	currentReport: ReportMonthResponse,
	index: number,
	array: ReadonlyArray<ReportMonthResponse>
): ExtendedReportMonthResponse => {
	const { categories: previousMonthCategories, total: previousMonthTotal } =
		array[index + 1] ?? {
			categories: [],
			total: 0
		};

	return {
		...currentReport,
		categories: currentReport.categories.map(
			extendCategory(previousMonthCategories)
		),
		totalChange: currentReport.total - previousMonthTotal
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
