import { setOrDeleteParam } from '../../src/routes/paramUtils';
import { identity } from 'fp-ts/es6/function';
import * as Try from '@craigmiller160/ts-functions/es/Try';

describe('paramUtils', () => {
	it('sets param for string value', () => {
		const params = new URLSearchParams();
		setOrDeleteParam(params)('foo', 'bar');
		expect(params.get('foo')).toEqual('bar');
	});

	it('deletes param for null value', () => {
		const params = new URLSearchParams();
		params.set('foo', 'bar');
		setOrDeleteParam(params)('foo', null);
		expect(params.get('foo')).toBeNull();
	});

	it('deletes param for undefined value', () => {
		const params = new URLSearchParams();
		params.set('foo', 'bar');
		setOrDeleteParam(params)('foo', undefined);
		expect(params.get('foo')).toBeNull();
	});

	it('sets param for falsy, non-nullish value', () => {
		const params = new URLSearchParams();
		setOrDeleteParam(params)('foo', '');
		expect(params.get('foo')).toEqual('');
	});

	it('transforms non-string param', () => {
		const params = new URLSearchParams();
		setOrDeleteParam(params)('foo', 1, (i) => i.toString());
		expect(params.get('foo')).toEqual('1');
	});

	it('transforms string param', () => {
		const params = new URLSearchParams();
		setOrDeleteParam(params)('foo', 'bar', identity);
		expect(params.get('foo')).toEqual('bar');
	});

	it('throws exception for non-string value without transform', () => {
		const params = new URLSearchParams();
		const result = Try.tryCatch(() => setOrDeleteParam(params)('foo', 1));
		expect(result).toEqualLeft(
			new Error(
				'Must provide transform to set non-string value on params'
			)
		);
	});
});
