import * as Time from '@craigmiller160/ts-functions/es/Time';
import { SortDirection } from '../types/misc';
import { Ordering } from 'fp-ts/es6/Ordering';
import { match } from 'ts-pattern';
import { pipe } from 'fp-ts/es6/function';

const SERVER_DATE_FORMAT = 'yyyy-MM-dd';
const SERVER_DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSSSSX";
const DISPLAY_DATE_FORMAT = 'MM/dd/yyyy';
const DISPLAY_DATE_TIME_FORMAT = 'MM/dd/yyyy hh:mm:ss a';
const REPORT_MONTH_FORMAT = 'MMM yyyy';

export const parseServerDate = Time.parse(SERVER_DATE_FORMAT);
export const formatServerDate = Time.format(SERVER_DATE_FORMAT);
export const parseDisplayDate = Time.parse(DISPLAY_DATE_FORMAT);
export const formatDisplayDate = Time.format(DISPLAY_DATE_FORMAT);
export const parseServerDateTime = Time.parse(SERVER_DATE_TIME_FORMAT);
export const formatServerDateTime = Time.format(SERVER_DATE_TIME_FORMAT);
export const parseDisplayDateTime = Time.parse(DISPLAY_DATE_TIME_FORMAT);
export const formatDisplayDateTime = Time.format(DISPLAY_DATE_TIME_FORMAT);
export const formatReportMonth = Time.format(REPORT_MONTH_FORMAT);

export const compareServerDates = (
	dateString1: string,
	dateString2: string,
	sortDirection: SortDirection
): Ordering => {
	const date1 = parseServerDate(dateString1);
	const date2 = parseServerDate(dateString2);
	return match(sortDirection)
		.with(SortDirection.ASC, () => Time.compare(date1)(date2))
		.otherwise(() => Time.compare(date2)(date1));
};

export const serverDateToDisplayDate = (serverDate: string): string =>
	pipe(serverDate, parseServerDate, formatDisplayDate);

export const serverDateTimeToDisplayDateTime = (
	serverDateTime: string
): string => pipe(serverDateTime, parseServerDateTime, formatDisplayDateTime);

export const serverDateToReportMonth = (serverDate: string): string =>
	pipe(serverDate, parseServerDate, formatReportMonth);
