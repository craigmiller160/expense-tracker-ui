import { addMinutes, format, set, subMilliseconds } from 'date-fns/fp';
import {
	compareServerDates,
	formatDisplayDate,
	formatDisplayDateTime,
	formatReportMonth,
	formatServerDate,
	formatServerDateTime,
	parseDisplayDate,
	parseDisplayDateTime,
	parseServerDate,
	parseServerDateTime,
	serverDateTimeToDisplayDateTime,
	serverDateToDisplayDate,
	serverDateToReportMonth
} from '../../src/utils/dateTimeUtils';
import { pipe } from 'fp-ts/function';
import { SortDirection } from '../../src/types/misc';

const createDate = (): Date =>
	set({
		year: 2022,
		month: 1,
		date: 1,
		hours: 0,
		minutes: 0,
		seconds: 0,
		milliseconds: 0
	})(new Date());
const createTimestamp = (): Date =>
	set({
		year: 2022,
		month: 1,
		date: 1,
		hours: 1,
		minutes: 1,
		seconds: 1,
		milliseconds: 1
	})(new Date());

const toUtc = (date: Date): Date => addMinutes(date.getTimezoneOffset())(date);
const getTimezoneSuffix = (date: Date = new Date()): string =>
	format('XXX')(date);

describe('dateTimeUtils', () => {
	it('parseServerDate', () => {
		const expected = createDate();
		const actual = parseServerDate('2022-02-01');
		expect(actual).toEqual(expected);
	});

	it('formatServerDate', () => {
		const date = createDate();
		expect(formatServerDate(date)).toBe('2022-02-01');
	});

	it('parseDisplayDate', () => {
		const expected = createDate();
		const actual = parseDisplayDate('02/01/2022');
		expect(actual).toEqual(expected);
	});

	it('formatDisplayDate', () => {
		const date = createDate();
		expect(formatDisplayDate(date)).toBe('02/01/2022');
	});

	it('parseServerDateTime', () => {
		const expected = createTimestamp();
		const actual = pipe(
			parseServerDateTime('2022-02-01T01:01:01.001000Z'),
			toUtc
		);
		expect(actual).toEqual(expected);
	});

	it('parseServerDateTime with non-UTC timezome', () => {
		const expected = set({
			year: 2022,
			month: 6,
			date: 2,
			hours: 14,
			minutes: 55,
			seconds: 13,
			milliseconds: 824
		})(new Date());
		const actual = parseServerDateTime('2022-07-02T14:55:13.824000-04:00');
		expect(actual).toEqual(expected);
	});

	it('formatServerDateTime', () => {
		const date = createTimestamp();
		const actual = formatServerDateTime(date);
		const tz = getTimezoneSuffix(date);
		const expected = `2022-02-01T01:01:01.001000${tz}`;
		expect(actual).toEqual(expected);
	});

	it('parseDisplayDateTime', () => {
		const expected = pipe(createTimestamp(), subMilliseconds(1));
		const actual = parseDisplayDateTime('02/01/2022 1:01:01 AM');
		expect(actual).toEqual(expected);
	});

	it('formatDisplayDateTime', () => {
		const date = createTimestamp();
		const expected = '02/01/2022 01:01:01 AM';
		const actual = formatDisplayDateTime(date);
		expect(actual).toEqual(expected);
	});

	it('formatReportMonth', () => {
		const date = createDate();
		const expected = format('MMM yyyy')(date);
		const actual = formatReportMonth(date);
		expect(actual).toEqual(expected);
	});

	it('serverDateToDisplayDate', () => {
		const expected = '02/01/2022';
		const actual = serverDateToDisplayDate('2022-02-01');
		expect(actual).toEqual(expected);
	});

	it('serverDateTimeToDisplayDateTime', () => {
		const date = createTimestamp();
		const expected = '02/01/2022 01:01:01 AM';
		const tz = getTimezoneSuffix(date);
		const actual = serverDateTimeToDisplayDateTime(
			`2022-02-01T01:01:01.001000${tz}`
		);
		expect(actual).toEqual(expected);
	});

	it('serverDateToReportMonth', () => {
		const expected = 'Feb 2022';
		const actual = serverDateToReportMonth('2022-02-01');
		expect(actual).toEqual(expected);
	});

	it('compareServerDates', () => {
		const date1 = '2022-01-01';
		const date2 = '2022-02-01';

		expect(compareServerDates(date1, date2, SortDirection.ASC)).toBe(-1);
		expect(compareServerDates(date1, date1, SortDirection.ASC)).toBe(0);
		expect(compareServerDates(date2, date1, SortDirection.ASC)).toBe(1);

		expect(compareServerDates(date1, date2, SortDirection.DESC)).toBe(1);
		expect(compareServerDates(date1, date1, SortDirection.DESC)).toBe(0);
		expect(compareServerDates(date2, date1, SortDirection.DESC)).toBe(-1);
	});
});
