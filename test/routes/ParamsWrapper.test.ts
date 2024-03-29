import { describe, it, expect } from 'vitest';
import {
	getOrDefaultParam,
	setOrDeleteParam
} from '../../src/routes/ParamsWrapper';
import { identity } from 'fp-ts/function';
import { Try } from '@craigmiller160/ts-functions';

describe('ParamsWrapper', () => {
	describe('setOrDeleteParam', () => {
		it('sets param for string value', () => {
			const params = new URLSearchParams();
			setOrDeleteParam(params)('foo', 'bar');
			expect(params.get('foo')).toBe('bar');
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
			expect(params.get('foo')).toBe('');
		});

		it('transforms non-string param', () => {
			const params = new URLSearchParams();
			setOrDeleteParam(params)('foo', 1, (i) => i.toString());
			expect(params.get('foo')).toBe('1');
		});

		it('transforms string param', () => {
			const params = new URLSearchParams();
			setOrDeleteParam(params)('foo', 'bar', identity);
			expect(params.get('foo')).toBe('bar');
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
			expect(result).toBe('bar');
		});

		it('gets default value for non-existent param', () => {
			const params = new URLSearchParams();
			const result = getOrDefaultParam(params)('foo', 'default');
			expect(result).toBe('default');
		});

		it('gets default value as null', () => {
			const params = new URLSearchParams();
			const result = getOrDefaultParam(params)('foo', null);
			expect(result).toBeNull();
		});

		it('gets default value as undefined', () => {
			const params = new URLSearchParams();
			const result = getOrDefaultParam(params)('foo', undefined);
			expect(result).toBeUndefined();
		});

		it('gets default non-string value for non-existent param', () => {
			const params = new URLSearchParams();
			const result = getOrDefaultParam(params)('foo', 1, (v) =>
				parseInt(v)
			);
			expect(result).toBe(1);
		});

		it('transforms value into non-string output', () => {
			const params = new URLSearchParams();
			params.set('foo', '2');
			const result = getOrDefaultParam(params)('foo', 1, (v) =>
				parseInt(v)
			);
			expect(result).toBe(2);
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
			expect(result).toBeNull();
		});
	});
});
