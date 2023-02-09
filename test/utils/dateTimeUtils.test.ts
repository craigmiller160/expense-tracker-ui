import { set } from 'date-fns/fp';
import { parseServerDate } from '../../src/utils/dateTimeUtils';

// 2022-07-02T14:55:13.824209-04:00

const createExpectedDate = (): Date =>
	set({
		year: 2022,
		month: 1,
		date: 1,
		hours: 0,
		minutes: 0,
		seconds: 0,
		milliseconds: 0
	})(new Date());
const createExpectedTimestamp = (): Date =>
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
		const expected = createExpectedDate();
		const actual = parseServerDate('2022-02-01');
		expect(actual).toEqual(expected);
	});

	it('formatServerDate', () => {
		throw new Error();
	});

	it('parseDisplayDate', () => {
		throw new Error();
	});

	it('formatDisplayDate', () => {
		throw new Error();
	});

	it('parseServerDateTime', () => {
		throw new Error();
	});

	it('formatServerDateTime', () => {
		throw new Error();
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
