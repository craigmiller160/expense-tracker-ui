import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
	ReportPageResponse,
	ReportRequest
} from '../../types/generated/expense-tracker';
import { getSpendingByMonthAndCategory } from '../service/ReportService';
import { debounceAsync } from '../../utils/debounceAsync';

export const GET_SPENDING_BY_MONTH_AND_CATEGORY =
	'ReportQueries_GetSpendingByMonthAndCategory';

type GetSpendingByMonthAndCategoryKey = [string, ReportRequest];

const debounceGetSpendingByMonthAndCategory = debounceAsync(
	getSpendingByMonthAndCategory,
	300
);
export const useGetSpendingByMonthAndCategory = (
	request: ReportRequest
): UseQueryResult<ReportPageResponse, Error> =>
	useQuery<
		ReportPageResponse,
		Error,
		ReportPageResponse,
		GetSpendingByMonthAndCategoryKey
	>([GET_SPENDING_BY_MONTH_AND_CATEGORY, request], ({ queryKey: [, req] }) =>
		debounceGetSpendingByMonthAndCategory(req)
	);
