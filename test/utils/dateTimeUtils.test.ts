import { set, addMinutes, format, subMilliseconds } from 'date-fns/fp';
import {
	formatDisplayDate,
	formatDisplayDateTime,
	formatReportMonth,
	formatServerDate,
	formatServerDateTime,
	parseDisplayDate,
	parseDisplayDateTime,
	parseServerDate,
	parseServerDateTime,
	serverDateToDisplayDate
} from '../../src/utils/dateTimeUtils';
import { pipe } from 'fp-ts/es6/function';

// 2022-07-02T14:55:13.824209-04:00

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

describe('dateTimeUtils', () => {
	it('parseServerDate', () => {
		const expected = createDate();
		const actual = parseServerDate('2022-02-01');
		expect(actual).toEqual(expected);
	});

	it('formatServerDate', () => {
		const date = createDate();
		expect(formatServerDate(date)).toEqual('2022-02-01');
	});

	it('parseDisplayDate', () => {
		const expected = createDate();
		const actual = parseDisplayDate('02/01/2022');
		expect(actual).toEqual(expected);
	});

	it('formatDisplayDate', () => {
		const date = createDate();
		expect(formatDisplayDate(date)).toEqual('02/01/2022');
	});

	it('parseServerDateTime', () => {
		const expected = createTimestamp();
		const actual = pipe(
			parseServerDateTime('2022-02-01T01:01:01.001000Z'),
			toUtc
		);
		expect(actual).toEqual(expected);
	});

	it('formatServerDateTime', () => {
		const date = createTimestamp();
		const actual = formatServerDateTime(date);
		const tz = format('X')(date);
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
		const expected = '02/01/2022 01:01:01 AM';
		const actual = serverDateToDisplayDate('2022-02-01T01:01:01.001000Z');
		expect(actual).toEqual(expected);
	});

	it('serverDateTimeToReportMonth', () => {
		const expected = 'Feb 2022';
		const actual = serverDateToDisplayDate('2022-02-01');
		expect(actual).toEqual(expected);
	});

	it('compareServerDates', () => {
		throw new Error();
	});
});
