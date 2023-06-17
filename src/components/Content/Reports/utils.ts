import {
	formatServerDate,
	parseServerDate
} from '../../../utils/dateTimeUtils';
import { flow } from 'fp-ts/es6/function';
import { endOfMonth, startOfMonth } from 'date-fns/fp';

const getStartAndEndDate = (dateString: string): [string, string] => {
	const date = parseServerDate(dateString);
	const startDate = flow(startOfMonth, formatServerDate)(date);
	const endDate = flow(endOfMonth, formatServerDate)(date);
	return [startDate, endDate];
};

export const getMonthLink = (dateString: string): string => {
	const [startDate, endDate] = getStartAndEndDate(dateString);
	return `/expense-tracker/transactions?startDate=${startDate}&endDate=${endDate}`;
};

export const getMonthAndCategoryLink = (
	dateString: string,
	categoryId: string,
	unknownCategoryId: string
): string => {
	if (categoryId === unknownCategoryId) {
		return `${getMonthLink(dateString)}&categorized=NO`;
	}
	return `${getMonthLink(dateString)}&category=${categoryId}`;
};
