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
	(previousMonthReport: ReportMonthResponse) =>
	(
		currentMonthCategory: ReportCategoryResponse
	): ExtendedReportCategoryResponse => {
		if (!previousMonthReport) {
			return currentMonthCategory;
		}

		const previousMonthCategory = previousMonthReport.categories.find(
			(cat) => cat.name === currentMonthCategory.name
		);
		return {
			...currentMonthCategory,
			amountChange:
				currentMonthCategory.amount -
				(previousMonthCategory?.amount ?? 0)
		};
	};

const extendReport = (
	currentMonthReport: ReportMonthResponse,
	index: number,
	array: ReadonlyArray<ReportMonthResponse>
): ExtendedReportMonthResponse => {
	const previousMonthReport: ReportMonthResponse | undefined =
		array[index + 1];
	if (!previousMonthReport) {
		return currentMonthReport;
	}

	return {
		...currentMonthReport,
		categories: currentMonthReport.categories.map(
			extendCategory(previousMonthReport)
		),
		totalChange: currentMonthReport.total - previousMonthReport.total
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
