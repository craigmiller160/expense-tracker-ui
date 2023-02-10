import { set, addMinutes } from 'date-fns/fp';
import {
	formatDisplayDate,
	formatServerDate,
	formatServerDateTime,
	parseDisplayDate,
	parseServerDate,
	parseServerDateTime
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
			(d) => addMinutes(d.getTimezoneOffset())(d)
		);
		expect(actual).toEqual(expected);
	});

	it('formatServerDateTime', () => {
		const date = createTimestamp();
		const actual = formatServerDateTime(date);
		const expected = '2022-02-01T01:01:01.001000Z';
		expect(actual).toEqual(expected);
	});

	it('parseDisplayDateTime', () => {
		throw new Error();
	});

	it('formatDisplayDateTime', () => {
		throw new Error();
	});

	it('formatReportMonth', () => {
		throw new Error();
	});

	it('serverDateToDisplayDate', () => {
		throw new Error();
	});

	it('serverDateTimeToDisplayDateTime', () => {
		throw new Error();
	});

	it('serverDateTimeToReportMonth', () => {
		throw new Error();
	});

	it('compareServerDates', () => {
		throw new Error();
	});
});
