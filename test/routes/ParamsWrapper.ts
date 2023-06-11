import {
	getOrDefaultParam,
	setOrDeleteParam
} from '../../src/routes/ParamsWrapper';
import { identity } from 'fp-ts/es6/function';
import * as Try from '@craigmiller160/ts-functions/es/Try';

describe('paramUtils', () => {
	describe('setOrDeleteParam', () => {
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
			const result = Try.tryCatch(() =>
				setOrDeleteParam(params)('foo', 1)
			);
			expect(result).toEqualLeft(
				new Error(
					'Must provide transform to set non-string value on params'
				)
			);
		});
	});

	describe('getOrDefaultParam', () => {
		it('gets param value', () => {
			const params = new URLSearchParams();
			params.set('foo', 'bar');
			const result = getOrDefaultParam(params)('foo', 'default');
			expect(result).toEqual('bar');
		});

		it('gets default value for non-existent param', () => {
			const params = new URLSearchParams();
			const result = getOrDefaultParam(params)('foo', 'default');
			expect(result).toEqual('default');
		});

		it('gets default non-string value for non-existent param', () => {
			const params = new URLSearchParams();
			const result = getOrDefaultParam(params)('foo', 1, (v) =>
				parseInt(v)
			);
			expect(result).toEqual(1);
		});

		it('transforms value into non-string output', () => {
			const params = new URLSearchParams();
			params.set('foo', '2');
			const result = getOrDefaultParam(params)('foo', 1, (v) =>
				parseInt(v)
			);
			expect(result).toEqual(2);
		});

		it('throws error when passing a non-string default with no transform', () => {
			const params = new URLSearchParams();
			const result = Try.tryCatch(() =>
				getOrDefaultParam(params)('foo', 1)
			);
			expect(result).toEqualLeft(
				new Error(
					'Must provide a transform argument if a non-string default is set'
				)
			);
		});

		it('returns null for non-existent param with null default', () => {
			const params = new URLSearchParams();
			const result = getOrDefaultParam(params)<
				{ foo: string | null },
				string | null
			>('foo', null, identity);
			expect(result).toEqual(null);
		});
	});
});
