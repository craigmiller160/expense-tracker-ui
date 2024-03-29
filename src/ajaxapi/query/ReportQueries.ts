import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { ReportPageResponse } from '../../types/generated/expense-tracker';
import { getSpendingByMonthAndCategory } from '../service/ReportService';
import { debounceAsync } from '../../utils/debounceAsync';
import { QUERY_DEBOUNCE } from './constants';
import type { ReportRequest } from '../../types/reports';

export const GET_SPENDING_BY_MONTH_AND_CATEGORY =
	'ReportQueries_GetSpendingByMonthAndCategory';

type GetSpendingByMonthAndCategoryKey = [string, ReportRequest];

const debounceGetSpendingByMonthAndCategory = debounceAsync(
	getSpendingByMonthAndCategory,
	QUERY_DEBOUNCE
);
export const useGetSpendingByMonthAndCategory = (
	request: ReportRequest
): UseQueryResult<ReportPageResponse, Error> =>
	useQuery<
		ReportPageResponse,
		Error,
		ReportPageResponse,
		GetSpendingByMonthAndCategoryKey
	>({
		queryKey: [GET_SPENDING_BY_MONTH_AND_CATEGORY, request],
		queryFn: ({ queryKey: [, req], signal }) =>
			debounceGetSpendingByMonthAndCategory(req, signal)
	});
