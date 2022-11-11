import { useQuery, UseQueryResult } from 'react-query';
import { ReportPageResponse } from '../../types/generated/expense-tracker';
import { getSpendingByMonthAndCategory } from '../service/ReportService';

export const GET_SPENDING_BY_MONTH_AND_CATEGORY =
	'ReportQueries_GetSpendingByMonthAndCategory';

type GetSpendingByMonthAndCategoryKey = [string, number, number];

export const useGetSpendingByMonthAndCategory = (
	pageNumber: number,
	pageSize: number
): UseQueryResult<ReportPageResponse, Error> =>
	useQuery<
		ReportPageResponse,
		Error,
		ReportPageResponse,
		GetSpendingByMonthAndCategoryKey
	>(
		[GET_SPENDING_BY_MONTH_AND_CATEGORY, pageNumber, pageSize],
		({ queryKey: [, page, size] }) =>
			getSpendingByMonthAndCategory(page, size)
	);
